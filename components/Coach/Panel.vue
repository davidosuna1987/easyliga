<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import GameService from '@/services/game'
import CallService from '@/services/call'
import { Game, mapApiGameToGame } from '@/domain/game'
import { Call, mapApiCallToCall } from '@/domain/call'
import { ApiCallUnlockedEventResponse } from '@/types/api/call'

const auth = useAuthStore()
const gameService = new GameService()
const callService = new CallService()
const toast = useEasyToast()

const currentGames = ref<Game[]>()
const calls = ref<Call[]>([])
const teamType = ref<TeamType>('local')
const loadingApi = ref<boolean>(false)

type TeamType = 'local' | 'visitor'

const getCurrentGames = async () => {
  if (!auth.user) return

  loadingApi.value = true
  const { data } = await gameService.fetch({
    where_has: `localTeam:coach_id:${auth.user.id}`,
    where: `status:!=:finished`,
  })

  currentGames.value = data.value?.data.games.map(game =>
    mapApiGameToGame(game),
  )

  if (currentGames.value?.length) {
    getCurrentGamesCalls()
  } else {
    teamType.value = 'visitor'

    const { data } = await gameService.fetch({
      where_has: `visitorTeam:coach_id:${auth.user.id}`,
      where: `status:!=:finished`,
    })

    currentGames.value = data.value?.data.games.map(game =>
      mapApiGameToGame(game),
    )

    if (currentGames.value?.length) {
      getCurrentGamesCalls()
    }
  }

  loadingApi.value = false
}

const getCurrentGamesCalls = () => {
  calls.value = []

  currentGames.value?.forEach(async game => {
    if (game.status === 'warmup') {
      const { data } = await callService.fetch({
        where: `game_id:${game.id}`,
      })

      const apiGameCall = data.value?.data.calls.find(
        call => call.team_id === game?.[`${teamType.value}TeamId`],
      )

      if (apiGameCall) {
        calls.value?.push(mapApiCallToCall(apiGameCall))
        listenCallUnlockedEvent(game.id, apiGameCall.id)
      }
    }
  })
}

const listenCallUnlockedEvent = (gameId: number, callId: number) => {
  window.Echo.channel(`game.${gameId}.call.${callId}.unlocked`).listen(
    'CallUnlockedEvent',
    (response: ApiCallUnlockedEventResponse) => {
      toast.info(useNuxtApp().$i18n.t('events.call_unlocked'))
      getCurrentGamesCalls()
    },
  )
}

onBeforeMount(getCurrentGames)
</script>

<template>
  <div class="easy-coach-panel-component flex flex-col">
    <Heading class="mb-5" position="center">
      {{
        auth.profile?.first_name
          ? $t('coaches.welcome', { name: auth.profile.first_name })
          : $t('coaches.welcome_no_name')
      }}
    </Heading>
    <LoadingLabel
      v-if="loadingApi"
      size="1.25rem"
      :label="$t('games.loading', 2)"
      class="flex justify-center"
    />
    <template v-else>
      <CoachCurrentGames
        v-if="currentGames?.length"
        :games="currentGames"
        :calls="calls"
      />
      <p v-else class="text-center">{{ $t('coaches.no_current_games') }}</p>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CoachPanel',
}
</script>