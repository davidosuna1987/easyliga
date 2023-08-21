<script lang="ts" setup>
import { GameInitialData, mapApiGameInitialDataToGame } from '@/domain/game'
import { Call, mapApiCallToCall } from '@/domain/call'
import GameService from '@/services/game'
import { ApiErrorObject } from '@/types/errors'
import { ApiCallUpdatedEventResponse } from '@/types/api/call'
import { ApiRotationCreatedEventResponse } from '@/types/api/rotation'

const route = useRoute()
const toast = useEasyToast()
const gameService = new GameService()

const gameInitialData = ref<GameInitialData>()
const localTeamCall = ref<Call>()
const visitorTeamCall = ref<Call>()
const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject | null>(null)

const getGameInitialData = async () => {
  loadingApi.value = true
  const { data, error } = await gameService.initialData(
    Number(route.params.game_id),
  )

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors))
    errors.value = error.value?.data?.errors
    return
  }

  gameInitialData.value = mapApiGameInitialDataToGame(data.value)
  localTeamCall.value = gameInitialData.value?.calls?.find(
    call => call.teamId === gameInitialData.value?.localTeam?.id,
  )
  visitorTeamCall.value = gameInitialData.value?.calls?.find(
    call => call.teamId === gameInitialData.value?.visitorTeam?.id,
  )
  loadingApi.value = false
}

const listenCallUpdatedEvent = () => {
  window.Echo.channel(`game.${route.params.game_id}.call.updated`).listen(
    'CallUpdatedEvent',
    (response: ApiCallUpdatedEventResponse) => {
      toast.info(
        useNuxtApp().$i18n.t('events.call_updated', {
          teamName: response.team.name,
        }),
        {
          life: 300000,
        },
      )
      if (response.team.id === gameInitialData.value?.localTeam?.id) {
        localTeamCall.value = mapApiCallToCall(response.call)
      } else {
        visitorTeamCall.value = mapApiCallToCall(response.call)
      }
    },
  )
}

const listenRotationCreatedEvent = () => {
  window.Echo.channel(`game.${route.params.game_id}.rotation.created`).listen(
    'RotationCreatedEvent',
    (response: ApiRotationCreatedEventResponse) => {
      toast.info(
        useNuxtApp().$i18n.t('events.rotation_created', {
          teamName: response.team.name,
        }),
        {
          life: 300000,
        },
      )
      if (response.team.id === gameInitialData.value?.localTeam?.id) {
        localTeamCall.value = mapApiCallToCall(response.call)
      } else {
        visitorTeamCall.value = mapApiCallToCall(response.call)
      }
    },
  )
}

const leaveCallUnlockedEvent = () => {
  window.Echo.leaveChannel(`game.${route.params.game_id}.call.updated`)
}

const leaveRotationCreateddEvent = () => {
  window.Echo.leaveChannel(`game.${route.params.game_id}.rotation.created`)
}

const listenEvents = () => {
  listenCallUpdatedEvent()
  listenRotationCreatedEvent()
}

const leaveEvents = () => {
  leaveCallUnlockedEvent()
  leaveRotationCreateddEvent()
}

onBeforeMount(() => {
  getGameInitialData()
})

onMounted(() => {
  listenEvents()
})

onBeforeUnmount(() => {
  leaveEvents()
})
</script>

<template>
  <div class="easy-referee-game-arbitrate-component">
    <GameStatus v-if="gameInitialData" :status="gameInitialData.game.status" />
    <RefereeGameTeamSetsWon
      v-if="gameInitialData"
      :localTeam="gameInitialData.localTeam"
      :visitorTeam="gameInitialData.visitorTeam"
    />
    <RefereeGameSidebarsCourt
      v-if="gameInitialData && localTeamCall && visitorTeamCall"
      :localTeam="gameInitialData.localTeam"
      :visitorTeam="gameInitialData.visitorTeam"
      :localTeamCall="localTeamCall"
      :visitorTeamCall="visitorTeamCall"
      @unlocked:call="getGameInitialData"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameArbitrate',
}
</script>
