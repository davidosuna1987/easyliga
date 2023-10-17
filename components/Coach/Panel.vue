<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import GameService from '@/services/game'
import CallService from '@/services/call'
import { Game, isValidCoachPanelGame, mapApiGameToGame } from '@/domain/game'
import { Call, mapApiCallToCall } from '@/domain/call'
import {
  ApiCallUnlockedEventResponse,
  ApiRotationLockToggledEventResponse,
  ApiTimeoutStatusUpdatedEventResponse,
} from '@/types/api/event'
import { TeamType } from '@/domain/team'
import { ApiEvents, ApiGameStatusUpdatedEventResponse } from '@/types/api/event'
import {
  Timeout,
  TimeoutStatusEnum,
  mapApiTimeoutToTimeout,
} from '@/domain/timeout'
import moment from 'moment'

const app = useNuxtApp()
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

  const commonParams = {
    where: `date:>=:${moment()
      .subtract(1, 'day')
      .format('YYYY-MM-DD HH:mm:ss')}`,
    with: `currentSet.rotations.players,currentSet.timeouts`,
  }

  const { data } = await gameService.fetch({
    where_has: `localTeam:coach_id:${auth.user.id}`,
    ...commonParams,
  })

  currentGames.value = data.value?.data.games
    .map(mapApiGameToGame)
    .filter(isValidCoachPanelGame)

  if (!currentGames.value?.length) {
    teamType.value = TeamType.VISITOR

    const { data } = await gameService.fetch({
      where_has: `visitorTeam:coach_id:${auth.user.id}`,
      ...commonParams,
    })

    currentGames.value = data.value?.data.games
      .map(mapApiGameToGame)
      .filter(isValidCoachPanelGame)
  }

  if (currentGames.value?.length) {
    await getCurrentGamesCalls()
  } else {
    loadingApi.value = false
  }
}

const getCurrentGamesCalls = async () => {
  loadingApi.value = true
  calls.value = []

  currentGames.value?.forEach(async game => {
    const { data } = await callService.fetch({
      where: `game_id:${game.id}`,
      with: 'currentRotation.players',
    })

    const apiGameCall = data.value?.data.calls.find(
      call => call.team_id === game?.[`${teamType.value}TeamId`],
    )

    if (apiGameCall) calls.value?.push(mapApiCallToCall(apiGameCall))

    window.Echo.leaveAllChannels()

    listenGameStatusUpdatedEvent(game.id)
    listenTimeoutStatusUpdatedEvent(game.id)

    calls.value?.forEach(call => {
      listenCallUnlockedEvent(game.id, call.id)
      listenRotationLockToggledEvent(game.id, call.currentRotation?.id)
    })

    loadingApi.value = false
  })
}

const setTimeoutStatus = (requestedTimeout: Timeout) => {
  const game = currentGames.value?.find(
    game => game.currentSet?.id === requestedTimeout.setId,
  )
  if (!game) return

  const timeout = game.currentSet?.timeouts?.find(
    timeout => timeout.id === requestedTimeout.id,
  )
  if (timeout) {
    timeout.status = requestedTimeout.status
  } else {
    game.currentSet?.timeouts?.push(requestedTimeout)
  }
}

const onCountdownEnded = (game: Game) => {
  const endedGame = currentGames.value?.find(g => g.id === game.id)
  if (!endedGame) return

  currentGames.value?.splice(
    currentGames.value?.map(g => g.id).indexOf(endedGame.id),
    1,
  )

  toast.info(
    app.$i18n.t('observations.countdown_ended', { gameName: game.name }),
  )
}

const listenCallUnlockedEvent = (gameId: number, callId: number) => {
  window.Echo.channel(`game.${gameId}.call.${callId}.unlocked`).listen(
    ApiEvents.CALL_UNLOCKED,
    (response: ApiCallUnlockedEventResponse) => {
      toast.info(
        response.call.locked
          ? app.$i18n.t('events.call_locked')
          : app.$i18n.t('events.call_unlocked'),
      )
      getCurrentGamesCalls()
    },
  )
}

const listenRotationLockToggledEvent = (
  gameId: number,
  rotationId?: number,
) => {
  if (!rotationId) return

  window.Echo.channel(
    `game.${gameId}.rotation.${rotationId}.lock-toggled`,
  ).listen(
    ApiEvents.ROTATION_LOCK_TOGGLED,
    (response: ApiRotationLockToggledEventResponse) => {
      toast.info(
        response.rotation.locked
          ? app.$i18n.t('events.rotation_locked')
          : app.$i18n.t('events.rotation_unlocked'),
      )
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
          app.$i18n.t('events.game_status_updated', {
            gameName: game.name,
            status: app.$i18n.t(`games.status.${response.status}`),
          }),
          {
            life: 30000,
          },
        )

        getCurrentGames()
      }
    },
  )
}

const listenTimeoutStatusUpdatedEvent = (gameId: number) => {
  window.Echo.channel(`game.${gameId}.timeout.status.updated`).listen(
    ApiEvents.TIMEOUT_STATUS_UPDATED,
    (response: ApiTimeoutStatusUpdatedEventResponse) => {
      const game = currentGames.value?.find(game => game.id === gameId)
      if (game) {
        if (response.timeout.status === TimeoutStatusEnum.finished) {
          toast.info(
            app.$i18n.t('events.timeout_status_finished_game', {
              gameName: game.name,
            }),
          )
        }

        if (response.timeout.status === TimeoutStatusEnum.running) {
          toast.info(
            app.$i18n.t('events.timeout_status_running_game', {
              gameName: game.name,
            }),
          )
        }

        const oldTimeout = game.currentSet?.timeouts?.find(
          timeout => timeout.id === response.timeout.id,
        )

        if (oldTimeout) {
          game.currentSet?.timeouts?.splice(
            game.currentSet?.timeouts
              ?.map(timeout => timeout.id)
              .indexOf(oldTimeout.id),
            1,
          )
        }

        const newTimeout = mapApiTimeoutToTimeout(response.timeout)
        game.currentSet?.timeouts?.push(newTimeout)
      }
    },
  )
}

// INFO: replaced with window.Echo.leaveAllChannels()
// const leaveCallUnlockedEvent = (gameId: number, callId: number) => {
//   window.Echo.leaveChannel(`game.${gameId}.call.${callId}.unlocked`)
// }

// const leaveRotationLockToggledEvent = (gameId: number, rotationId: number) => {
//   window.Echo.leaveChannel(`game.${gameId}.rotation.${rotationId}.lock-toggled`)
// }

// const leaveGameStatusUpdatedEvent = (gameId: number) => {
//   window.Echo.leaveChannel(`game.${gameId}.status.updated`)
// }

// const leaveTimeoutStatusUpdatedEvent = (gameId: number) => {
//   window.Echo.leaveChannel(`game.${gameId}.timeout.status.updated`)
// }

onBeforeMount(getCurrentGames)
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
        @timeout:requested="setTimeoutStatus"
        @countdown:ended="onCountdownEnded"
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
