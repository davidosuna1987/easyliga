<script lang="ts" setup>
import { GameInitialData, mapApiGameInitialDataToGame } from '@/domain/game'
import { Call, mapApiCallToCall } from '@/domain/call'
import GameService from '@/services/game'
import { ApiErrorObject } from '@/types/errors'
import { ApiCallUpdatedEventResponse } from '@/types/api/call'

definePageMeta({
  middleware: ['role'],
  roles: ['referee'],
})

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

onBeforeMount(() => {
  getGameInitialData()
})

onMounted(() => {
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
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-referee-game-arbitrate-page">
      <RefereeGameCallSidebar
        v-if="localTeamCall && gameInitialData?.localTeam"
        :team="gameInitialData.localTeam"
        :call="localTeamCall"
      />
      <div class="easy-referee-game-arbitrate-content">
        <h1 class="text-center">CONTENT</h1>
      </div>
      <RefereeGameCallSidebar
        v-if="visitorTeamCall && gameInitialData?.visitorTeam"
        :team="gameInitialData.visitorTeam"
        :call="visitorTeamCall"
      />
    </div>
  </NuxtLayout>
</template>

<script lang="ts">
export default {
  name: 'RefereeGamesArbitrateGamePage',
}
</script>
