<script setup lang="ts">
import GameService from '@/services/game'
import CallService from '@/services/call'
import { Game, Player, mapApiGameToGame } from '@/domain/game'
import {
  Call,
  getCaptainIdFromCallPlayersData,
  getLiberoIdFromCallPlayersData,
  getProfileIdsFromCallPlayersData,
  mapApiCallToCall,
} from '@/domain/call'
import { ApiErrorObject } from '@/types/errors'
import { mapApiPlayersToPlayers } from '@/domain/players'

const route = useRoute()
const toast = useEasyToast()
const gameService = new GameService()
const callService = new CallService()

const game = ref<Game>()
const call = ref<Call>()
const players = ref<Player[]>([])
const selectedProfileIds = ref<number[]>([])
const captain = ref<number>(0)
const libero = ref<number>(0)
const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject>()

const form = computed(() => {
  return {
    profile_ids: selectedProfileIds.value,
    captain_id: captain.value,
    libero_id: libero.value,
  }
})

const selectedCaptain = computed(() => {
  if (!captain.value) return undefined

  return (
    call.value?.playersData.find(
      playerData => playerData.profileId === captain.value,
    ) ?? players.value.find(player => player.id === captain.value)
  )
})

const selectedLibero = computed(() => {
  if (!libero.value) return undefined

  return (
    call.value?.playersData.find(
      playerData => playerData.profileId === libero.value,
    ) ?? players.value.find(player => player.id === libero.value)
  )
})

const showGameLockedToast = () => {
  toast.error(useNuxtApp().$i18n.t('calls.locked_warning'))
}

const togglePlayer = (id: number) => {
  if (!call.value) return

  if (call.value.locked) {
    showGameLockedToast()
    return
  }

  if (selectedProfileIds.value?.includes(id)) {
    selectedProfileIds.value?.splice(selectedProfileIds.value?.indexOf(id), 1)

    if (captain.value === id) {
      captain.value = 0
    }

    if (libero.value === id) {
      libero.value = 0
    }
  } else {
    selectedProfileIds.value?.push(id)

    if (
      players.value.find(player => player.id === id)?.captain &&
      !captain.value
    ) {
      captain.value = id
    }

    if (
      players.value.find(player => player.id === id)?.libero &&
      !libero.value
    ) {
      libero.value = id
    }
  }
}

const updateCaptain = (id: number) => {
  if (!call.value) return

  if (call.value.locked) {
    showGameLockedToast()
    return
  }

  captain.value = id
}

const updateLibero = (id: number) => {
  if (!call.value) return

  if (call.value.locked) {
    showGameLockedToast()
    return
  }

  libero.value = id
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
  console.log(data.value.data.call.locked, call.value.locked)
}

const getTeamPlayers = async () => {
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
  selectedProfileIds.value = getProfileIdsFromCallPlayersData(
    call.value.playersData,
  )
  captain.value = getCaptainIdFromCallPlayersData(call.value.playersData)
  libero.value = getLiberoIdFromCallPlayersData(call.value.playersData)
  players.value = mapApiPlayersToPlayers(data.value.data.players)
}

onBeforeMount(() => {
  getTeamPlayers()
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
        :call="call"
        :players="players"
        :profileIds="selectedProfileIds"
        :captain="captain"
        :libero="libero"
        :togglePlayer="togglePlayer"
        :updateCaptain="updateCaptain"
        :updateLibero="updateLibero"
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
  </form>
</template>

<script lang="ts">
export default {
  name: 'GameCallForm',
}
</script>
