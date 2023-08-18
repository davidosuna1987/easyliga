<script setup lang="ts">
import GameService from '@/services/game'
import CallService from '@/services/call'
import { Game, Player, mapApiGameToGame } from '@/domain/game'
import {
  Call,
  mapApiCallToCall,
  mapCallPlayersDataToPlayers,
} from '@/domain/call'
import { ApiErrorObject } from '@/types/errors'
import { mapApiPlayersToPlayers } from '@/domain/players'
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
const shirtNumberUpdatePlayer = ref<Player>()
const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject>()

const form = computed(() => {
  return {
    players: mapPlayersToApiCallRequestPlayers(selectedPlayers.value),
  }
})

const selectedCaptain = computed(() =>
  selectedPlayers.value.find(player => player.captain),
)

const selectedLibero = computed(() =>
  selectedPlayers.value.find(player => player.libero),
)

const showGameLockedToast = () => {
  toast.error(useNuxtApp().$i18n.t('calls.locked_warning'))
}

const removeSelectedPlayer = (player: Player) => {
  if (typeof player !== 'object') return

  const index = selectedPlayers.value?.findIndex(
    p => p.profileId === player.profileId,
  )
  selectedPlayers.value?.splice(index, 1)
}

const addSelectedPlayer = (player: Player) => {
  if (typeof player !== 'object') return

  selectedPlayers.value?.push({
    ...player,
    captain: selectedCaptain.value ? false : !!player.captain,
    libero: selectedLibero.value ? false : !!player.libero,
  })
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

const setCaptain = (id: number) => {
  if (!call.value) return

  if (call.value.locked) {
    showGameLockedToast()
    return
  }

  selectedPlayers.value.forEach(player => {
    player.captain = player.profileId === id
  })
}

const setLibero = (id: number) => {
  if (!call.value) return

  if (call.value.locked) {
    showGameLockedToast()
    return
  }

  selectedPlayers.value.forEach(player => {
    player.libero = player.profileId === id
  })
}

const setShirtNumberUpdatePlayer = (player?: Player) => {
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

    shirtNumberUpdatePlayer.value = player
  }
}

const submit = async () => {
  if (!call.value) return

  if (call.value.locked) {
    showGameLockedToast()
    return
  }

  const { data, error } = await callService.update(call.value.id, form.value)

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    errors.value = error.value?.data?.errors
    return
  }

  toast.success(useNuxtApp().$i18n.t('calls.submitted'))
  call.value = mapApiCallToCall(data.value.data.call)
}

const getTeamPlayers = async (listenEvent = false) => {
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

  if (listenEvent) {
    listenCallUnlockedEvent()
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

  <form
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
      />
    </FormLabel>
    <div class="grid gap-4 md:grid-cols-2 items-start mt-4">
      <div>
        <GameCallSelectedCaptain :player="selectedCaptain" class="mb-3" />
        <GameCallSelectedLibero :player="selectedLibero" />
      </div>
      <div class="grid justify-end">
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
      :player="shirtNumberUpdatePlayer"
      @update:player="setShirtNumberUpdatePlayer"
      @hide="setShirtNumberUpdatePlayer"
    />
  </form>
</template>

<script lang="ts">
export default {
  name: 'GameCallForm',
}
</script>
