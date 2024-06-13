<script setup lang="ts">
import CallService from '@/services/call'
import SetService from '@/services/set'
import RotationService from '@/services/rotation'
import {
  Call,
  CallPlayerData,
  mapApiCallToCall,
  MIN_CALL_PLAYERS,
} from '@/domain/call'
import { Set, mapApiSetToSet } from '@/domain/set'
import { ApiRotationStoreRequest } from '@/types/api/rotation'
import {
  ROTATION_PLAYERS_LENGTH,
  Rotation,
  RotationPlayer,
  mapRotationPlayerToApiRotationPlayer,
} from '@/domain/rotation'
import {
  EXPULSION_SEVERITIES,
  mapApiSanctionToSanction,
  mergeSanctionsRemovingDuplicates,
  Sanction,
  SanctionType,
} from '@/domain/sanction'
import { getFullName } from '@/domain/player'
import { mapApiProfileToProfile } from '@/domain/profile'
import { ApiEvents, ApiSanctionStoredEventResponse } from '@/types/api/event'

const props = defineProps({
  initialRotation: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'update:set', value: Set): void
}>()

const { t } = useI18n()
const route = useRoute()
const toast = useEasyToast()

const callService = new CallService()
const setService = new SetService()
const rotationService = new RotationService()

const gameSets = ref<Set[]>([])
const gameSanctions = ref<Sanction[]>()
const call = ref<Call>()
const loadingApi = ref<boolean>(false)

const form = ref<ApiRotationStoreRequest>()

const currentSet = computed(
  (): Set => gameSets.value[gameSets.value.length - 1],
)

const currentSetRotation = computed((): Rotation | undefined =>
  currentSet.value?.rotations?.find(
    rotation => rotation.callId === call.value?.id,
  ),
)

const currentSetHasRotation = computed(
  (): boolean => !!currentSetRotation.value,
)

const rotationSanctions = computed((): Sanction[] =>
  mergeSanctionsRemovingDuplicates(
    currentSet.value?.gameSanctions ?? [],
    currentSet.value?.sanctions ?? [],
  ),
)

const currentSetTeamMemberSanctions = computed((): Sanction[] | undefined =>
  rotationSanctions.value?.filter(
    sanction =>
      sanction.type === SanctionType.member &&
      sanction.teamId === call.value?.teamId,
  ),
)

const rotationPlayersToBeReplacedForSanction = computed(
  (): CallPlayerData[] => {
    const playerIdsToBeReplaced = currentSetTeamMemberSanctions.value
      ?.filter(sanction => {
        const inCourtProfileIds = form.value?.players?.map(
          player => player.in_court_profile_id,
        )

        return (
          sanction.type === SanctionType.member &&
          !!EXPULSION_SEVERITIES.includes(sanction.severity) &&
          sanction.playerProfileId &&
          inCourtProfileIds?.includes(sanction.playerProfileId ?? 0)
        )
      })
      .map(sanction => sanction.playerProfileId)

    return (
      call.value?.playersData.filter(player =>
        playerIdsToBeReplaced?.includes(player.profileId),
      ) ?? []
    )
  },
)

const createInitialRotation = (): void => {
  if (!call.value || !currentSet.value) return
  form.value = {
    call_id: call.value.id,
    set_id: currentSet.value.id,
    in_court_captain_profile_id: 0,
    number: 1,
    players: [],
  }
}

const getInitialData = async (): Promise<void> => {
  loadingApi.value = true
  await Promise.all([getGameSets(), getCall()])
  createInitialRotation()
  loadingApi.value = false
}

const getGameSets = async (): Promise<void> => {
  const { data } = await setService.fetch({
    where: `game_id:${route.params.game_id}`,
    with: 'rotations.players,sanctions',
    set_appends: 'game_sanctions',
  })

  gameSets.value = data.value?.data.sets.map(mapApiSetToSet) ?? []
  if (data.value?.data.sets) {
    gameSanctions.value = data.value.data.sets
      .at(data.value.data.sets.length - 1)
      ?.game_sanctions?.map(mapApiSanctionToSanction)
  }
}

const getCall = async (): Promise<void> => {
  const { data } = await callService.get(Number(route.params.call_id))

  if (data.value?.data.call) {
    call.value = mapApiCallToCall(data.value?.data.call)
  }
}

const setRotationPlayers = (players: RotationPlayer[]): void => {
  if (!form.value) return
  form.value.players = players.map(mapRotationPlayerToApiRotationPlayer)
}

const setRotationInCourtCaptain = (profileId: number): void => {
  if (!form.value) return
  form.value.in_court_captain_profile_id = profileId
}

const handleSubmit = async (): Promise<void> => {
  if (!form.value) return

  if (form.value.players.length < ROTATION_PLAYERS_LENGTH) {
    toast.error(
      t('errors.assign_min_rotation_players', {
        num: MIN_CALL_PLAYERS,
      }),
    )
    return
  }

  if (!form.value.in_court_captain_profile_id) {
    toast.error(t('errors.assign_in_court_captain'))
    return
  }

  loadingApi.value = true

  const { data, error } = await rotationService.store(form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    loadingApi.value = false
  } else {
    toast.success(t('rotations.assign_success'))
    navigateTo(`/coach`)
  }
}

const listenSanctionStoredEvent = (): void => {
  window.Echo.channel(`game.${route.params.game_id}.sanction.stored`).listen(
    ApiEvents.SANCTION_STORED,
    (response: ApiSanctionStoredEventResponse) => {
      const sanctionedPlayer = response.profile
        ? mapApiProfileToProfile(response.profile)
        : undefined

      toast.error(
        t(`sanctions.sanctioned.${response.sanction.severity}`, {
          name: getFullName(sanctionedPlayer) ?? response.team.name,
        }),
      )
      getInitialData()
    },
  )
}

watch(currentSet, (): void => emit('update:set', currentSet.value))

watch(currentSetRotation, (): void => {
  if (currentSetRotation.value?.players) {
    setRotationPlayers(currentSetRotation.value?.players)
  }
})

onMounted((): void => {
  listenSanctionStoredEvent()
  getInitialData()
})

onBeforeUnmount((): void => {
  window.Echo.leaveAllChannels()
})
</script>

<template>
  <div class="easy-coach-rotation-form-component">
    <Loading v-if="loadingApi" />

    <Message v-if="currentSetHasRotation" :closable="false">{{
      $t('rotations.created_warning')
    }}</Message>

    <RotationPlayerSanctionedMessage
      v-if="rotationPlayersToBeReplacedForSanction.length"
      :playersData="rotationPlayersToBeReplacedForSanction"
    />

    <template v-if="call?.locked">
      <p v-if="!currentSetHasRotation" class="text-center mb-8">
        {{ $t('rotations.assign_howto') }}
      </p>
      <form @submit.prevent="handleSubmit">
        <CoachRotationCourt
          :call="call"
          :currentSet="currentSet"
          :rotation="currentSetRotation"
          :isInitialRotationAssignment="initialRotation"
          :gameSanctions="gameSanctions"
          :sanctions="currentSetTeamMemberSanctions"
          @update:players="setRotationPlayers"
          @update:captain="setRotationInCourtCaptain"
        />

        <div
          v-if="!currentSetRotation?.players?.length"
          class="flex items-center justify-end mt-24 md:mt-8"
        >
          <Button
            type="submit"
            class="easy-coach-rotation-court-component__button"
          >
            {{ $t('rotations.assign') }}
          </Button>
        </div>
      </form>
    </template>
    <template v-else>
      <p class="text-center mb-8">
        {{ $t('rotations.assign_call') }}
      </p>
      <div class="grid place-content-center">
        <CoachButtonCall
          v-if="call"
          :gameId="call.gameId"
          :teamId="call.teamId"
          :locked="call.locked"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CoachRotationForm',
}
</script>
