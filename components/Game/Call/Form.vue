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
import {
  ApiCallUnlockedEventResponse,
  mapPlayersToApiCallRequestPlayers,
} from '@/types/api/call'

const route = useRoute()
const toast = useEasyToast()

const gameService = new GameService()
const callService = new CallService()

const game = ref<Game>()
const call = ref<Call>()
const players = ref<Player[]>([])
const selectedPlayers = ref<Player[]>([])
const selectedCaptain = ref<Player>()
const shirtNumberUpdatePlayer = ref<Player>()
const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject>()

const form = computed(() => {
  return {
    players: mapPlayersToApiCallRequestPlayers(selectedPlayers.value),
  }
})

const selectedLiberos = computed(() =>
  selectedPlayers.value.filter(player => player.libero),
)

const showGameLockedToast = () => {
  toast.warn(useNuxtApp().$i18n.t('calls.locked_warning'))
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

  if (call.value.locked) {
    // showGameLockedToast()
    return
  }

  selectedPlayers.value.map(player => (player.captain = false))

  const player = selectedPlayers.value?.find(
    player => player.profileId === profileId,
  )
  if (player) {
    player.captain = !player.captain
  }

  selectedCaptain.value = player
}

const setLibero = (profileId: number) => {
  if (!call.value) return

  if (call.value.locked) {
    // showGameLockedToast()
    return
  }

  const player = selectedPlayers.value?.find(
    player => player.profileId === profileId,
  )

  if (
    !player?.libero &&
    selectedLiberos.value.length >= MAX_CALL_LIBERO_PLAYERS
  ) {
    toast.error(
      useNuxtApp().$i18n.t('errors.max_liberos', {
        max: MAX_CALL_LIBERO_PLAYERS,
      }),
    )
    return
  }

  if (player) {
    player.libero = !player.libero
  }
}

const setShirtNumberUpdatePlayer = (player: Player) => {
  shirtNumberUpdatePlayer.value = player
}

const changePlayerShirtNumber = (player?: Player) => {
  if (
    !player ||
    !selectedPlayers.value.find(p => p.profileId === player.profileId)
  ) {
    shirtNumberUpdatePlayer.value = undefined
  } else {
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

const getTeamPlayers = async (listenEvent = false) => {
  loadingApi.value = true

  const { data, error } = await gameService.teamPlayers(
    Number(route.params.game_id),
    Number(route.params.team_id),
  )

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    errors.value = error.value?.data?.errors
    return
  }

  game.value = mapApiGameToGame(data.value.data.game)
  call.value = mapApiCallToCall(data.value.data.call)
  selectedPlayers.value = mapCallPlayersDataToPlayers(call.value.playersData)
  players.value = mapApiPlayersToPlayers(data.value.data.players)

  loadingApi.value = false

  if (listenEvent) {
    listenCallUnlockedEvent()
  }
}

const submit = async () => {
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
    toast.success(useNuxtApp().$i18n.t('calls.submitted'))
    navigateTo(`/coach`)
  }
}

const listenCallUnlockedEvent = () => {
  window.Echo.channel(
    `game.${route.params.game_id}.call.${call.value?.id}.unlocked`,
  ).listen('CallUnlockedEvent', (response: ApiCallUnlockedEventResponse) => {
    toast.info(useNuxtApp().$i18n.t('events.call_unlocked'))
    getTeamPlayers()
  })
}

const leaveCallUnlockedEvent = () => {
  window.Echo.leaveChannel(
    `game.${route.params.game_id}.call.${call.value?.id}.unlocked`,
  )
}

onBeforeMount(() => {
  getTeamPlayers(true)
})

onBeforeUnmount(() => {
  leaveCallUnlockedEvent()
})
</script>

<template>
  <Heading tag="h5" position="center" class="mb-5">{{ game?.name }}</Heading>

  <Message v-if="call?.locked" :closable="false">{{
    $t('calls.locked_warning')
  }}</Message>

  <Loading v-if="loadingApi" />
  <form
    v-if="call"
    class="easy-game-call-form-component"
    :class="{ 'is-locked': call?.locked }"
    @submit.prevent="submit"
  >
    <FormLabel :label="$t('calls.select')">
      <GameCallList
        :players="players"
        :selectedPlayers="selectedPlayers"
        :togglePlayer="togglePlayer"
        :setCaptain="setCaptain"
        :setLibero="setLibero"
        :setShirtNumberUpdatePlayer="setShirtNumberUpdatePlayer"
        :setCaptainToggleDisabledProfileId="selectedCaptain?.profileId"
        :tooltipsDisabled="call?.locked"
      />
    </FormLabel>
    <div class="grid gap-4 md:grid-cols-2 items-start mt-4">
      <div>
        <!-- <GameCallSelectedCaptain :player="selectedCaptain" class="mb-3" /> -->
        <GameCallSelectedLibero
          v-for="libero in selectedLiberos"
          class="mb-3"
          :player="libero"
        />
      </div>
      <div v-if="!call?.locked" class="grid justify-end">
        <Button
          class="mt-3"
          type="submit"
          :label="call?.locked ? $t('calls.locked') : $t('calls.submit')"
          :disabled="call?.locked"
          :loading="loadingApi"
        />
      </div>
    </div>
    <GameCallShirtNumberDialog
      :call="call"
      :player="shirtNumberUpdatePlayer"
      @update:player="changePlayerShirtNumber"
      @hide="shirtNumberUpdatePlayer = undefined"
    />
  </form>
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
