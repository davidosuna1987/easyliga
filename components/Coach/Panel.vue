<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import GameService from '@/services/game'
import CallService from '@/services/call'
import { Game, mapApiGameToGame } from '@/domain/game'
import { Call, mapApiCallToCall } from '@/domain/call'
import {
  ApiCallUnlockedEventResponse,
  ApiRotationLockToggledEventResponse,
} from '@/types/api/event'
import { TeamType } from '@/domain/team'
import { ApiEvents, ApiGameStatusUpdatedEventResponse } from '@/types/api/event'

const auth = useAuthStore()
const gameService = new GameService()
const callService = new CallService()
const toast = useEasyToast()

const currentGames = ref<Game[]>()
const calls = ref<Call[]>([])
const teamType = ref<TeamType>(TeamType.LOCAL)
const loadingApi = ref<boolean>(false)

const getCurrentGames = async () => {
  if (!auth.user) return

  loadingApi.value = true

  const commonParams = {
    where: `status:!=:finished`,
    with: `currentSet.rotations.players`,
  }

  const { data } = await gameService.fetch({
    where_has: `localTeam:coach_id:${auth.user.id}`,
    ...commonParams,
  })

  currentGames.value = data.value?.data.games.map(game =>
    mapApiGameToGame(game),
  )

  if (currentGames.value?.length) {
    await getCurrentGamesCalls()
  } else {
    teamType.value = TeamType.VISITOR

    const { data } = await gameService.fetch({
      where_has: `visitorTeam:coach_id:${auth.user.id}`,
      ...commonParams,
    })

    currentGames.value = data.value?.data.games.map(game =>
      mapApiGameToGame(game),
    )

    if (currentGames.value?.length) {
      await getCurrentGamesCalls()
    } else {
      loadingApi.value = false
    }
  }
}

const getCurrentGamesCalls = async () => {
  loadingApi.value = true
  calls.value = []

  currentGames.value?.forEach(async game => {
    if (['warmup', 'resting', 'playing'].includes(game.status)) {
      const { data } = await callService.fetch({
        where: `game_id:${game.id}`,
        with: 'currentRotation.players',
      })

      const apiGameCall = data.value?.data.calls.find(
        call => call.team_id === game?.[`${teamType.value}TeamId`],
      )

      if (apiGameCall) {
        calls.value?.push(mapApiCallToCall(apiGameCall))
        listenCallUnlockedEvent(game.id, apiGameCall.id)
        listenGameStatusUpdatedEvent(game.id)
        calls.value?.forEach(call => {
          call.currentRotation &&
            listenRotationLockToggledEvent(game.id, call.currentRotation.id)
        })
      }
    }

    loadingApi.value = false
  })
}

const listenCallUnlockedEvent = (gameId: number, callId: number) => {
  window.Echo.channel(`game.${gameId}.call.${callId}.unlocked`).listen(
    ApiEvents.CALL_UNLOCKED,
    (response: ApiCallUnlockedEventResponse) => {
      toast.info(useNuxtApp().$i18n.t('events.call_unlocked'))
      getCurrentGamesCalls()
    },
  )
}

const listenRotationLockToggledEvent = (gameId: number, rotationId: number) => {
  window.Echo.channel(
    `game.${gameId}.rotation.${rotationId}.lock-toggled`,
  ).listen(
    ApiEvents.ROTATION_LOCK_TOGGLED,
    (response: ApiRotationLockToggledEventResponse) => {
      toast.info(useNuxtApp().$i18n.t('events.rotation_unlocked'))
      getCurrentGamesCalls()
    },
  )
}

const listenGameStatusUpdatedEvent = (gameId: number) => {
  window.Echo.channel(`game.${gameId}.status.updated`).listen(
    ApiEvents.GAME_STATUS_UPDATED,
    (response: ApiGameStatusUpdatedEventResponse) => {
      const game = currentGames.value?.find(game => game.id === gameId)
      if (game) {
        toast.info(
          useNuxtApp().$i18n.t('events.game_status_updated', {
            gameName: game.name,
            status: useNuxtApp().$i18n.t(`games.status.${response.status}`),
          }),
          {
            life: 30000,
          },
        )

        getCurrentGamesCalls()

        if (response.status === 'finished') {
          currentGames.value?.splice(
            currentGames.value?.findIndex(game => game.id === gameId),
            1,
          )
        } else {
          game.status = response.status
        }
      }
    },
  )
}

const leaveCallUnlockedEvent = (gameId: number, callId: number) => {
  window.Echo.leaveChannel(`game.${gameId}.call.${callId}.unlocked`)
}

const leaveRotationLockToggledEvent = (gameId: number, rotationId: number) => {
  window.Echo.leaveChannel(`game.${gameId}.rotation.${rotationId}.lock-toggled`)
}

const leaveGameStatusUpdatedEvent = (gameId: number) => {
  window.Echo.leaveChannel(`game.${gameId}.status.updated`)
}

onBeforeMount(getCurrentGames)
onBeforeUnmount(() => {
  calls.value?.forEach(call => {
    leaveCallUnlockedEvent(call.gameId, call.id)
    leaveGameStatusUpdatedEvent(call.gameId)
    call.currentRotation &&
      leaveRotationLockToggledEvent(call.gameId, call.currentRotation.id)
  })
})
</script>

<template>
  <div class="easy-coach-panel-component flex flex-col">
    <Heading class="mb-5" position="center">
      {{
        auth.profile?.firstName
          ? $t('coaches.welcome', { name: auth.profile.firstName })
          : $t('coaches.welcome_no_name')
      }}
    </Heading>
    <Loading v-if="loadingApi" />
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
