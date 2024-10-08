<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import GameService from '@/services/game'
import { Game, mapApiGameToGame, isMatchDayPassed } from '@/domain/game'
import { formatDateByLocale } from '@/domain/utils'

const { t, locale } = useI18n()
const auth = useAuthStore()
const route = useRoute()
const toast = useEasyToast()
const gameService = new GameService()

const game = ref<Game>()
const loadingApi = ref<boolean>(false)

const getGame = async () => {
  loadingApi.value = true

  const { data, error } = await gameService.get(Number(route.params.gameId), {
    with: 'localTeam,visitorTeam,club,league.federation.federation,league.category,league.gender',
  })

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    const mappedGame = mapApiGameToGame(data.value.data.game)
    if (!authUserCanUpdateGameDate(mappedGame)) {
      toast.error(t('errors.not_allowed_to_edit_game_date'))
      navigateTo('/')
    } else {
      game.value = mappedGame
    }
  }

  loadingApi.value = false
}

const authUserCanUpdateGameDate = (game: Game) => {
  if (!auth.user) return false
  if (auth.hasAnyRole(['admin', 'staff'])) return true
  if (!auth.hasRole('coach')) return false

  return (
    game.refereeId === auth.user.id ||
    game.localTeam?.coachId === auth.user.id ||
    game.visitorTeam?.coachId === auth.user.id ||
    game.club?.responsibleId === auth.user.id ||
    game.league?.federation?.responsibleId === auth.user.id ||
    game.league?.federation?.federation?.responsibleId === auth.user.id
  )
}

onMounted(getGame)
</script>

<template>
  <div
    class="easy-coach-game-edit-component flex flex-col items-center text-center"
  >
    <Loading v-if="loadingApi" />
    <template v-else-if="game">
      <GameInfoHeader class="mb-5" :game="game" center />

      <GameChangeDateStatus
        v-if="game.requestedDate && !game.status && !isMatchDayPassed(game)"
        class="mb-3"
        :game="game"
        fullDate
      />

      <CoachGameDateForm
        v-if="!game.status"
        :game="game"
        inlineButton
        @date:requested="getGame"
        @date:approved="getGame"
      />
      <GameStatus v-else :status="game.status" />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CoachGameEdit',
}
</script>
