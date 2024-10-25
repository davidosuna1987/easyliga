<script setup lang="ts">
import { ApiErrorObject } from '@/types/errors'
import RotationService from '@/services/rotation'
import InjuryService from '@/services/injury'
import { Game } from '@/domain/game'
import {
  ROTATION_PLAYER_STATUS,
  Rotation,
  RotationPlayerChangeRequest,
  RotationUpdateRequest,
  mapApiRotationToRotation,
  mapRotationPlayerChangeRequestToRotationUpdateRequestPlayer,
  mapRotationUpdateRequestToApiRotationUpdateRequest,
} from '@/domain/rotation'
import {
  ApiEvents,
  ApiRotationLockToggledEventResponse,
  ApiSanctionStoredEventResponse,
} from '@/types/api/event'
import {
  EXPULSION_SEVERITIES,
  Sanction,
  SanctionSeverity,
  SanctionType,
  mergeSanctionsRemovingDuplicates,
} from '@/domain/sanction'
import { CallPlayerData } from '@/domain/call'
import { getFullName } from '@/domain/player'
import { mapApiProfileToProfile } from '@/domain/profile'
import { InjuryFormRequest } from '@/domain/injury'

const { t } = useI18n()
const route = useRoute()
const toast = useEasyToast()

const rotationService = new RotationService()
const injuryService = new InjuryService()

const listenedEvents = ref<string[]>([])
const game = ref<Game>()
const rotation = ref<Rotation>()
const initialRotation = ref<Rotation>()
const rotationSanctions = ref<Sanction[]>()
const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject>()

const form = ref<Rotation>()
const requestedPlayerChanges = ref<RotationPlayerChangeRequest[]>([])

const currentSetTeamMemberSanctions = computed((): Sanction[] | undefined =>
  rotationSanctions.value?.filter(
    sanction =>
      sanction.type === SanctionType.member &&
      sanction.teamId === rotation.value?.call?.teamId,
  ),
)

const rotationPlayersToBeReplacedForSanction = computed(
  (): CallPlayerData[] => {
    const playerIdsToBeReplaced = currentSetTeamMemberSanctions.value
      ?.filter(sanction => {
        const inCourtProfileIds = rotation.value?.players?.map(
          player => player.inCourtProfileId,
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
      rotation.value?.call?.playersData.filter(player =>
        playerIdsToBeReplaced?.includes(player.profileId),
      ) ?? []
    )
  },
)

const getRotation = async () => {
  loadingApi.value = true

  const { data, error } = await rotationService.get(
    Number(route.params.rotationId),
    {
      with: 'game.currentSet,game.sanctions,call.team,players,setSanctions,injuries',
      set_appends: 'current_rotation,player_changes_count',
    },
  )

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    errors.value = error.value?.data?.errors
    return
  }

  if (
    data.value.data.rotation?.game?.current_set?.id !==
    data.value.data.rotation?.set_id
  ) {
    toast.warn(t('rotations.set_changed'))
    navigateTo('/coach')
    return
  }

  const pendingPlayerChanges = data.value.data.rotation.players.filter(
    player => player.status === ROTATION_PLAYER_STATUS.pending,
  )

  if (pendingPlayerChanges.length && !rotation.value) {
    toast.warn(t('player_change_requests.changes_waiting_approval'))
    navigateTo('/coach')
    return
  }

  initialRotation.value = mapApiRotationToRotation(data.value.data.rotation)
  rotation.value = mapApiRotationToRotation(data.value.data.rotation)
  game.value = rotation.value.game
  form.value = rotation.value

  const rotationSetSanctions = rotation.value.setSanctions ?? []

  const gameSanctions =
    rotation.value.game?.sanctions?.filter(
      sanction =>
        sanction.type === SanctionType.member &&
        sanction.severity === SanctionSeverity.game &&
        sanction.teamId === rotation.value?.call?.teamId,
    ) ?? []

  rotationSanctions.value = mergeSanctionsRemovingDuplicates(
    rotationSetSanctions,
    gameSanctions,
  )

  leaveAllChannels()
  listenAllChannels(game.value?.id, rotation.value.id)

  loadingApi.value = false
}

const setRotationCaptain = (profileId?: number) => {
  if (!rotation.value) return

  if (typeof profileId === 'undefined') {
    rotation.value.inCourtCaptainProfileId = 0
    return
  }

  rotation.value.inCourtCaptainProfileId = profileId
}

const setFormPlayerChanges = (playerChanges: RotationPlayerChangeRequest[]) => {
  if (!form.value) return

  const clonedInitialRotation: Rotation = JSON.parse(
    JSON.stringify(initialRotation.value),
  )

  // back to initial rotation in court captain
  if (
    !form.value.players
      .map(p => p.inCourtProfileId)
      .includes(form.value.inCourtCaptainProfileId)
  ) {
    form.value.inCourtCaptainProfileId =
      clonedInitialRotation?.inCourtCaptainProfileId ?? 0
  }

  requestedPlayerChanges.value = playerChanges

  // back to initial rotation players
  if (!playerChanges.length) {
    form.value.players = clonedInitialRotation?.players ?? []
    form.value.inCourtCaptainProfileId =
      clonedInitialRotation?.inCourtCaptainProfileId ?? 0
    return
  }

  form.value.players.forEach(player => {
    const initialPlayer = clonedInitialRotation.players.find(
      p => p.profileId === player.profileId,
    )

    const playerChange = playerChanges.find(
      playerChange => playerChange.profileId === player.profileId,
    )

    if (playerChange) {
      player.replacementProfileId = playerChange.replacementProfileId
      player.inCourtProfileId = playerChange.inCourtProfileId
      player.libero = playerChange.libero
    } else if (initialPlayer) {
      player.replacementProfileId = initialPlayer.replacementProfileId
      player.inCourtProfileId = initialPlayer.inCourtProfileId ?? 0
      player.libero = initialPlayer.libero
    }
  })
}

const handleSubmit = async () => {
  if (!form.value) return

  if (form.value.locked) {
    toast.warn(t('rotations.locked_warning'))
    return
  }

  if (!form.value.inCourtCaptainProfileId) {
    toast.error(t('errors.assign_in_court_captain'))
    return
  }
  loadingApi.value = true

  const rotationUpdateRequest: RotationUpdateRequest = {
    changeWindow: form.value.currentChangeWindow,
    inCourtCaptainProfileId: form.value.inCourtCaptainProfileId,
    players: requestedPlayerChanges.value.map(
      mapRotationPlayerChangeRequestToRotationUpdateRequestPlayer,
    ),
  }

  const { data, error } = await rotationService.update(
    Number(route.params.rotationId),
    mapRotationUpdateRequestToApiRotationUpdateRequest(rotationUpdateRequest),
  )

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    errors.value = error.value?.data?.errors
    loadingApi.value = false
    return
  } else {
    toast.success(t('rotations.player_change_requested'))
    navigateTo('/coach')
    // requestedPlayerChanges.value = []
    // location.reload()
  }

  getRotation()
}

const handleInjuryStore = async (injuryFormRequest: InjuryFormRequest) => {
  loadingApi.value = true

  const { data, error } = await injuryService.store(injuryFormRequest)

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    errors.value = error.value?.data?.errors
    loadingApi.value = false
    return
  } else {
    toast.success(t('injuries.stored'))
    getRotation()
  }
}

const listenRotationLockToggledEvent = (
  gameId?: number,
  rotationId?: number,
) => {
  if (!gameId || !rotationId) return
  listenedEvents.value.push(
    `game.${gameId}.rotation.${rotationId}.lock-toggled`,
  )
  window.Echo.channel(
    `game.${gameId}.rotation.${rotationId}.lock-toggled`,
  ).listen(
    ApiEvents.ROTATION_LOCK_TOGGLED,
    (response: ApiRotationLockToggledEventResponse) => {
      toast.info(
        response.rotation.locked
          ? t('events.rotation_locked')
          : t('events.rotation_unlocked'),
      )
      getRotation()
    },
  )
}

const listenSanctionStoredEvent = (gameId?: number) => {
  if (!gameId) return
  listenedEvents.value.push(`game.${gameId}.sanction.stored`)
  window.Echo.channel(`game.${gameId}.sanction.stored`).listen(
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
      getRotation()
    },
  )
}

const listenAllChannels = (gameId?: number, rotationId?: number) => {
  if (!listenedEvents.value.includes(`game.${gameId}.sanction.stored`)) {
    listenSanctionStoredEvent()
  }
  if (
    !listenedEvents.value.includes(
      `game.${gameId}.rotation.${rotationId}.lock-toggled`,
    )
  ) {
    listenRotationLockToggledEvent(gameId, rotationId)
  }
}

const leaveAllChannels = () => {
  window.Echo.leaveAllChannels()
  listenedEvents.value = []
}

onMounted(getRotation)

onBeforeUnmount(() => {
  leaveAllChannels()
})
</script>

<template>
  <Loading v-if="loadingApi" />

  <form
    class="easy-coach-rotation-player-change-form-component"
    @submit.prevent="handleSubmit"
  >
    <Heading
      tag="h5"
      position="center"
      class="mb-5"
      v-highlight="rotation?.call?.team?.name"
    >
      {{ game?.name }}
    </Heading>

    <Message v-if="rotation?.locked" :closable="false">
      {{ t('rotations.locked_warning') }}
    </Message>

    <RotationPlayerSanctionedMessage
      v-if="rotationPlayersToBeReplacedForSanction.length"
      :playersData="rotationPlayersToBeReplacedForSanction"
    />

    <div
      class="form-lockable-section"
      :class="{ 'is-locked': rotation?.locked }"
    >
      <CoachRotationCourt
        v-if="form && rotation && rotation.call"
        :call="rotation.call"
        :rotation="form"
        :initialRotation="initialRotation"
        :isInitialRotationAssignment="false"
        :sanctions="currentSetTeamMemberSanctions"
        @change:players="setFormPlayerChanges"
        @update:captain="setRotationCaptain"
        @playerRotationStatusUpdated="getRotation"
        @injury:changed="handleInjuryStore"
      />

      <!-- <footer class="flex justify-end items-center mt-24 md:mt-8">
        <Button
          type="submit"
          :disabled="!requestedPlayerChanges.length"
          :label="
            form?.locked
              ? t('rotations.locked')
              : t('rotations.player_change', requestedPlayerChanges.length)
          "
        />
      </footer> -->
      <FormFooterActions
        class="mt-8"
        :disabled="!requestedPlayerChanges.length"
        :submitLabel="
          form?.locked
            ? t('rotations.locked')
            : t('rotations.player_change', requestedPlayerChanges.length)
        "
        hideCancel
        stickyBreakpoint="sm"
        @form:submit="handleSubmit"
      />
    </div>
  </form>
</template>

<style scoped lang="scss">
.form-lockable-section {
  &.is-locked {
    pointer-events: none !important;
    filter: grayscale(1);
  }
}
</style>

<script lang="ts">
export default {
  name: 'RotationPlayerChangeForm',
}
</script>
