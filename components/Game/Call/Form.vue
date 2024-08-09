<script setup lang="ts">
import GameService from '@/services/game'
import CallService from '@/services/call'
import { Game, mapApiGameToGame } from '@/domain/game'
import { Player, mapApiPlayersToPlayers } from '@/domain/player'
import {
  Call,
  MAX_CALL_LIBERO_PLAYERS,
  mapApiCallToCall,
  mapCallPlayersDataToPlayers,
} from '@/domain/call'
import { ApiErrorObject } from '@/types/errors'
import { mapPlayersToApiCallRequestPlayers } from '@/types/api/call'
import { ApiCallUnlockedEventResponse } from '@/types/api/event'
import { ApiEvents } from '@/types/api/event'
import { TeamMember, TeamType } from '@/domain/team'
import {
  GameSignatureTypes,
  GameSignatureStoreRequest,
  mapGameSignatureStoreRequestToApiGameSignatureStoreRequest,
  mapApiGameSignatureToGameSignature,
} from '@/domain/game-signature'
import GameSignatureService from '@/services/game-signature'

const { t } = useI18n()
const route = useRoute()
const toast = useEasyToast()

const gameService = new GameService()
const callService = new CallService()
const gameSignatureService = new GameSignatureService()

const listenedEvents = ref<string[]>([])
const game = ref<Game>()
const call = ref<Call>()
const teamType = ref<TeamType>()
const players = ref<Player[]>([])
const selectedPlayers = ref<Player[]>([])
const selectedCaptain = ref<Player>()
const shirtNumberUpdatePlayer = ref<Player | TeamMember>()
const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject>()

const showSignatureDialog = ref<boolean>(false)
const showLowerCategoryTeamsWithPlayers = ref<boolean>(false)
const loadingSignature = ref<boolean>(false)

const form = computed(() => {
  return {
    players: mapPlayersToApiCallRequestPlayers(selectedPlayers.value),
  }
})

const selectedLiberos = computed(() =>
  selectedPlayers.value.filter(player => player.libero),
)

const callSigned = computed(() => {
  if (!call.value) return false

  return game.value?.signatures?.some(
    signature =>
      signature.gameId === call.value?.gameId &&
      signature.teamId === call.value?.teamId &&
      signature.type === GameSignatureTypes.coach,
  )
})

const showGameLockedToast = () => {
  toast.warn(t('calls.locked_warning'))
}

const removeSelectedPlayer = (player: Player) => {
  if (typeof player !== 'object') return

  const index = selectedPlayers.value?.findIndex(
    p => p.profileId === player.profileId,
  )
  selectedPlayers.value?.splice(index, 1)

  if (selectedCaptain.value?.profileId === player.profileId) {
    selectedCaptain.value = undefined
  }

  if (selectedLiberos.value?.find(p => p.profileId === player.profileId)) {
    selectedLiberos.value?.map(p => p.profileId !== player.profileId)
  }
}

const addSelectedPlayer = (player: Player) => {
  if (typeof player !== 'object') return

  const shirtNumberExists = selectedPlayers.value.some(
    selectedPlayer => selectedPlayer.shirtNumber === player.shirtNumber,
  )
  // if (shirtNumberExists) {
  //   toast.error(t('shirts.already_in_use'))
  //   return
  // }

  // selectedPlayers.value?.push(player)

  // ADD PLAYER REMOVING WITHOUT LIBERO OR CAPTAIN IF ARE SET
  selectedPlayers.value?.push({
    ...player,
    captain: selectedCaptain.value ? false : !!player.captain,
    // libero: selectedLibero.value ? false : !!player.libero,
  })

  if (!selectedCaptain.value && !!player.captain) {
    selectedCaptain.value = player
  }
}

const togglePlayer = (player: Player) => {
  console.log('foo')
  if (!call.value) return

  if (call.value.locked) {
    showGameLockedToast()
    return
  }

  if (selectedPlayers.value?.some(p => p.profileId === player.profileId)) {
    removeSelectedPlayer(player)
  } else {
    addSelectedPlayer(player)
  }
}

const setCaptain = (profileId: number) => {
  if (!call.value) return
  if (call.value.locked) return

  const player = selectedPlayers.value?.find(
    player => player.profileId === profileId,
  )

  if (!player?.captain && player?.libero) {
    toast.error(t('errors.libero_cannot_be_captain'))
    return
  }

  selectedPlayers.value.map(player => (player.captain = false))

  if (player) {
    player.captain = !player.captain
  }

  selectedCaptain.value = player
}

const setLibero = (profileId: number) => {
  if (!call.value) return
  if (call.value.locked) return

  const player = selectedPlayers.value?.find(
    player => player.profileId === profileId,
  )

  if (
    !player?.libero &&
    selectedLiberos.value.length >= MAX_CALL_LIBERO_PLAYERS
  ) {
    toast.error(
      t('errors.max_liberos', {
        max: MAX_CALL_LIBERO_PLAYERS,
      }),
    )
    return
  }

  if (!player?.libero && player?.captain) {
    toast.error(t('errors.libero_cannot_be_captain'))
    return
  }

  if (player) {
    player.libero = !player.libero
  }
}

const setShirtNumberUpdatePlayer = (player: Player | TeamMember) => {
  shirtNumberUpdatePlayer.value = player
}

const changePlayerShirtNumber = (player?: Player) => {
  if (
    !player ||
    !selectedPlayers.value.find(p => p.profileId === player.profileId)
  ) {
    shirtNumberUpdatePlayer.value = undefined
  } else {
    if (
      selectedPlayers.value.find(
        p =>
          p.shirtNumber === player.shirtNumber &&
          p.profileId !== player.profileId,
      )
    ) {
      toast.error(t('shirts.already_in_use'))
      return
    }

    players.value.map(p => {
      if (p.profileId === player.profileId) {
        p.shirtNumber = player.shirtNumber
      }
    })

    const selectedPlayer = selectedPlayers.value.find(
      p => p.profileId === player.profileId,
    )
    const removedPlayer = selectedPlayer
      ? structuredClone(toRaw(selectedPlayer))
      : undefined

    removeSelectedPlayer(player)
    addSelectedPlayer(player)

    if (removedPlayer?.captain) {
      setCaptain(removedPlayer.profileId)
    }

    if (removedPlayer?.libero) {
      setLibero(removedPlayer.profileId)
    }

    shirtNumberUpdatePlayer.value = undefined
  }
}

const getTeamPlayers = async () => {
  leaveAllChannels()

  loadingApi.value = true

  const { data, error } = await gameService.teamPlayers(
    Number(route.params.game_id),
    Number(route.params.team_id),
  )

  loadingApi.value = false

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    errors.value = error.value?.data?.errors
    return
  }

  game.value = mapApiGameToGame(data.value.data.game)
  call.value = mapApiCallToCall(data.value.data.call)
  selectedPlayers.value = mapCallPlayersDataToPlayers(call.value.playersData)
  players.value = mapApiPlayersToPlayers(data.value.data.players)
  teamType.value = data.value.data.team_type

  listenAllChannels()
}

const handleSignOrSubmit = () => {
  if (callSigned.value) {
    handleSubmit()
  } else {
    showSignatureDialog.value = true
  }
}

const handleSignatureCreated = async (signature: GameSignatureStoreRequest) => {
  if (!game.value) return

  loadingSignature.value = true

  const { data, error } = await gameSignatureService.store(
    game.value.id,
    mapGameSignatureStoreRequestToApiGameSignatureStoreRequest(signature),
  )

  loadingSignature.value = false

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    return
  }

  game.value.signatures?.push(
    mapApiGameSignatureToGameSignature(data.value.data.game_signature),
  )

  showSignatureDialog.value = false

  handleSubmit()
}

const handleSubmit = async () => {
  if (!call.value) return

  if (call.value.locked) {
    showGameLockedToast()
    return
  }

  loadingApi.value = true

  const { data, error } = await callService.update(call.value.id, form.value)

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    errors.value = error.value?.data?.errors
    loadingApi.value = false
  } else {
    toast.success(t('calls.submitted'))
    navigateTo(`/coach`)
  }
}

const listenCallUnlockedEvent = () => {
  listenedEvents.value.push(
    `game.${route.params.game_id}.call.${call.value?.id}.unlocked`,
  )
  window.Echo.channel(
    `game.${route.params.game_id}.call.${call.value?.id}.unlocked`,
  ).listen(
    ApiEvents.CALL_UNLOCKED,
    (response: ApiCallUnlockedEventResponse) => {
      toast.info(
        response.call.locked
          ? t('events.call_locked')
          : t('events.call_unlocked'),
      )
      getTeamPlayers()
    },
  )
}

const listenAllChannels = () => {
  if (
    !listenedEvents.value.includes(
      `game.${route.params.game_id}.call.${call.value?.id}.unlocked`,
    )
  ) {
    listenCallUnlockedEvent()
  }
}

const leaveAllChannels = () => {
  window.Echo.leaveAllChannels()
  listenedEvents.value = []
}

// INFO: replaced with window.Echo.leaveAllChannels()
// const leaveCallUnlockedEvent = () => {
//   window.Echo.leaveChannel(
//     `game.${route.params.game_id}.call.${call.value?.id}.unlocked`,
//   )
// }

onMounted(getTeamPlayers)
</script>

<template>
  <Heading tag="h5" position="center" class="mb-5">{{ game?.name }}</Heading>

  <Message v-if="call?.locked" :closable="false">{{
    t('calls.locked_warning')
  }}</Message>

  <Loading v-if="loadingApi" />
  <form
    v-if="call"
    class="easy-game-call-form-component"
    :class="{ 'is-locked': call?.locked }"
    @submit.prevent="handleSignOrSubmit()"
  >
    <FormLabel :label="t('calls.select')" />
    <GameCallList
      :players="players"
      :selectedPlayers="selectedPlayers"
      :togglePlayer="togglePlayer"
      :setCaptain="setCaptain"
      :setLibero="setLibero"
      :setShirtNumberUpdatePlayer="setShirtNumberUpdatePlayer"
      :setCaptainToggleDisabledProfileId="selectedCaptain?.profileId"
      :tooltipsDisabled="!!call?.locked"
    />

    <div v-if="showLowerCategoryTeamsWithPlayers" class="mt-10">
      <FormLabel
        :label="t('teams.lower_category_teams_with_players.callable')"
        class="mb-3"
      />
      <TeamLowerCategoryTeamsWithPlayers
        :teamId="call.teamId"
        :selectedPlayers="selectedPlayers"
        :togglePlayer="togglePlayer"
        :setCaptain="setCaptain"
        :setLibero="setLibero"
        :setShirtNumberUpdatePlayer="setShirtNumberUpdatePlayer"
        :setCaptainToggleDisabledProfileId="selectedCaptain?.profileId"
        :tooltipsDisabled="!!call?.locked"
      />
    </div>

    <EasyGrid class="mt-4" :gap="3" :breakpoints="{ md: 2 }" items="start">
      <div>
        <GameCallSelectedLibero
          v-for="libero in selectedLiberos"
          class="mb-3"
          :player="libero"
        />
      </div>
      <EasyGrid v-if="!call?.locked" justify="end">
        <Button
          v-if="!showLowerCategoryTeamsWithPlayers"
          severity="link"
          class="p-0 ml-auto mr-0 w-min whitespace-nowrap"
          :label="
            showLowerCategoryTeamsWithPlayers
              ? t('teams.lower_category_teams_with_players.hide')
              : t('teams.lower_category_teams_with_players.show')
          "
          @click.prevent="
            showLowerCategoryTeamsWithPlayers =
              !showLowerCategoryTeamsWithPlayers
          "
        />
        <FormFooterActions
          :submitLabel="call?.locked ? t('calls.locked') : t('calls.submit')"
          :disabled="call?.locked"
          :loading="loadingApi"
          hideCancel
          @form:submit="handleSignOrSubmit"
        />
      </EasyGrid>
    </EasyGrid>
    <GameCallShirtNumberDialog
      :call="call"
      :player="shirtNumberUpdatePlayer"
      @update:player="changePlayerShirtNumber"
      @hide="shirtNumberUpdatePlayer = undefined"
    />
  </form>

  <SignatureDialog
    :visible="showSignatureDialog"
    :loading="loadingSignature"
    :save-inline="false"
    :type="GameSignatureTypes.coach"
    :team-type="teamType"
    @hide="showSignatureDialog = false"
    @signature:created="handleSignatureCreated"
  />
</template>

<style scoped lang="scss">
.easy-game-call-form-component {
  &.is-locked {
    pointer-events: none !important;
    filter: grayscale(1);
  }
}
</style>

<script lang="ts">
export default {
  name: 'GameCallForm',
}
</script>
