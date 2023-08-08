<script lang="ts" setup>
import { GameInitialData, mapApiGameInitialDataToGame } from '@/domain/game'
import GameService from '@/services/game'
import { ApiErrorObject } from '@/types/errors'

definePageMeta({
  middleware: ['role'],
  roles: ['referee'],
})

const route = useRoute()
const toast = useEasyToast()
const gameService = new GameService()

const loadingApi = ref<boolean>(false)
const gameInitialData = ref<GameInitialData>()
const errors = ref<ApiErrorObject | null>(null)

const getGameInitialData = async () => {
  loadingApi.value = true
  const { data, error } = await gameService.initialData(Number(route.params.id))

  if (error.value || !data.value) {
    if (error.value?.data?.errors instanceof Array) {
      toast.error(error.value.data?.errors[0])
    } else {
      toast.correctErrors()
    }
    errors.value = error.value?.data?.errors
    return
  }

  gameInitialData.value = mapApiGameInitialDataToGame(data.value)
  loadingApi.value = false
}

onBeforeMount(() => {
  getGameInitialData()
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-referee-game-arbitrate-page">
      <GameTeamSidebar
        v-if="gameInitialData?.localTeam"
        :team="gameInitialData.localTeam"
      />
      <div class="easy-referee-game-arbitrate-content">
        <h1 class="text-center">CONTENT</h1>
      </div>
      <GameTeamSidebar
        v-if="gameInitialData?.visitorTeam"
        :team="gameInitialData.visitorTeam"
      />
    </div>
  </NuxtLayout>
</template>

<script lang="ts">
export default {
  name: 'RefereeGamesArbitratePage',
}
</script>
