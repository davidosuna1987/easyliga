<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import GameService from '@/services/game'
import CallService from '@/services/call'
import { Game, isValidCoachPanelGame, mapApiGameToGame } from '@/domain/game'
import { Call, mapApiCallToCall } from '@/domain/call'
import {
  ApiCallUnlockedEventResponse,
  ApiRotationLockToggledEventResponse,
  ApiSanctionStoredEventResponse,
  ApiTimeoutStatusUpdatedEventResponse,
  ApiEvents,
  ApiGameStatusUpdatedEventResponse,
  ApiGameSignatureCreatedEventResponse,
  ApiRequestChangeDateEventResponse,
} from '@/types/api/event'
import { TeamType } from '@/domain/team'
import {
  Timeout,
  TimeoutStatusEnum,
  mapApiTimeoutToTimeout,
} from '@/domain/timeout'
import { mapApiProfileToProfile } from '@/domain/profile'
import { getFullName } from '@/domain/player'
import { Rotation } from '@/domain/rotation'
import { EXPULSION_SEVERITIES } from '@/domain/sanction'
import moment from 'moment'
import { formatDate, formatDateByLocale } from '@/domain/utils'

const { t, locale } = useI18n()
const auth = useAuthStore()
const gameService = new GameService()
const callService = new CallService()
const toast = useEasyToast()

const listenedEvents = ref<string[]>([])
const selectedDate = ref<Date>(new Date())
const selectedDateGames = ref<Game[]>([])
const calls = ref<Call[]>([])
const loadingApi = ref<boolean>(false)

const getGamesByDate = async (
  date: Date | string = selectedDate.value,
  type: TeamType = TeamType.LOCAL,
) => {
  if (!auth.user) return

  leaveAllChannels()

  loadingApi.value = true

  if (type === TeamType.LOCAL) {
    selectedDateGames.value = []
  }

  date = new Date(date)
  selectedDate.value = date
  const formatedDate = formatDate(date.toString(), '-', true)
  const formatedDateLeft = `${formatedDate} 00:00:00`
  const formatedDateRight = `${formatedDate} 23:59:59`

  const { data, error } = await gameService.fetch({
    where: `date:>=:${formatedDateLeft},date:<=:${formatedDateRight}`,
    where_has: `${type}Team:coach_id:${auth.user.id}`,
    with: `localTeam,visitorTeam,currentSet.rotations.players,currentSet.timeouts,currentSet.sanctions,signatures`,
  })

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    selectedDateGames.value = [
      ...selectedDateGames.value,
      ...data.value?.data.games
        .map(mapApiGameToGame)
        .filter(isValidCoachPanelGame),
    ]

    if (type === TeamType.LOCAL) {
      await getGamesByDate(date, TeamType.VISITOR)
    }
  }

  // remove duplicated games
  selectedDateGames.value = selectedDateGames.value.filter(
    (game, index, self) =>
      index === self.findIndex(g => g.id === game.id && g.date === game.date),
  )

  if (selectedDateGames.value?.length) {
    await getSelectedDateGamesCalls()
  } else {
    loadingApi.value = false
  }
}

const getSelectedDateGamesCalls = async () => {
  loadingApi.value = true
  calls.value = []

  selectedDateGames.value?.forEach(async game => {
    const { data } = await callService.fetch({
      where: `game_id:${game.id}`,
      with: 'currentRotation.players',
    })

    const teamType =
      game.localTeam?.coachId === auth.user?.id
        ? TeamType.LOCAL
        : TeamType.VISITOR

    const apiGameCall = data.value?.data.calls.find(
      call => call.team_id === game?.[`${teamType}TeamId`],
    )

    if (apiGameCall) calls.value.push(mapApiCallToCall(apiGameCall))

    listenAllChannels(game.id)

    loadingApi.value = false
  })
}

const setTimeoutStatus = (requestedTimeout: Timeout) => {
  const game = selectedDateGames.value?.find(
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

const onCountdownEnded = async ({ game, call }: { game: Game; call: Call }) => {
  const endedGame = selectedDateGames.value?.find(g => g.id === game.id)
  if (!endedGame) return

  const callToSign = calls.value.find(c => c.id === call.id && !c.signedAt)

  if (callToSign) {
    const signData = { signedAt: moment().format('YYYY-MM-DD HH:mm:ss') }
    await callService.sign(call.id, signData)
  }

  selectedDateGames.value?.splice(
    selectedDateGames.value?.map(g => g.id).indexOf(endedGame.id),
    1,
  )

  toast.info(t('reports.closed', { gameName: game.name }))
}

const onReportSigned = (game: Game) => {
  const signedGame = selectedDateGames.value?.find(g => g.id === game.id)
  if (!signedGame) return

  selectedDateGames.value?.splice(
    selectedDateGames.value?.map(g => g.id).indexOf(signedGame.id),
    1,
  )

  toast.info(t('reports.closed', { gameName: game.name }))
}

const currentSetRotation = (
  gameId: number,
  callId: number,
): Rotation | undefined =>
  selectedDateGames.value
    ?.find(game => game.id === gameId)
    ?.currentSet?.rotations?.find(rotation => rotation.callId === callId)

const listenCallUnlockedEvent = (gameId: number, callId: number) => {
  listenedEvents.value.push(`game.${gameId}.call.${callId}.unlocked`)
  window.Echo.channel(`game.${gameId}.call.${callId}.unlocked`).listen(
    ApiEvents.CALL_UNLOCKED,
    (response: ApiCallUnlockedEventResponse) => {
      toast.info(
        response.call.locked
          ? t('events.call_locked')
          : t('events.call_unlocked'),
      )
      getSelectedDateGamesCalls()
    },
  )
}

const listenRotationLockToggledEvent = (
  gameId: number,
  rotationId?: number,
) => {
  listenedEvents.value.push(
    `game.${gameId}.rotation.${rotationId}.lock-toggled`,
  )
  if (!rotationId) return

  window.Echo.channel(
    `game.${gameId}.rotation.${rotationId}.lock-toggled`,
  ).listen(
    ApiEvents.ROTATION_LOCK_TOGGLED,
    (response: ApiRotationLockToggledEventResponse) => {
      toast.info(
        response.rotation.locked
          ? t('events.rotation_locked')
          : t('events.rotation_unlocked'),
      )
      getGamesByDate()
    },
  )
}

const listenGameStatusUpdatedEvent = (gameId: number) => {
  listenedEvents.value.push(`game.${gameId}.status.updated`)
  window.Echo.channel(`game.${gameId}.status.updated`).listen(
    ApiEvents.GAME_STATUS_UPDATED,
    (response: ApiGameStatusUpdatedEventResponse) => {
      const game = selectedDateGames.value?.find(game => game.id === gameId)
      if (game) {
        toast.info(
          t('events.game_status_updated', {
            gameName: game.name,
            status: t(`games.status.${response.status}`),
          }),
          {
            life: 30000,
          },
        )

        getGamesByDate()
      }
    },
  )
}

const listenTimeoutStatusUpdatedEvent = (gameId: number) => {
  listenedEvents.value.push(`game.${gameId}.timeout.status.updated`)
  window.Echo.channel(`game.${gameId}.timeout.status.updated`).listen(
    ApiEvents.TIMEOUT_STATUS_UPDATED,
    (response: ApiTimeoutStatusUpdatedEventResponse) => {
      const game = selectedDateGames.value?.find(game => game.id === gameId)
      if (game) {
        if (response.timeout.status === TimeoutStatusEnum.finished) {
          toast.info(
            t('events.timeout_status_finished_game', {
              gameName: game.name,
            }),
          )
        }

        if (response.timeout.status === TimeoutStatusEnum.running) {
          toast.info(
            t('events.timeout_status_running_game', {
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

const listenSanctionStoredEvent = (gameId: number) => {
  listenedEvents.value.push(`game.${gameId}.sanction.stored`)
  window.Echo.channel(`game.${gameId}.sanction.stored`).listen(
    ApiEvents.SANCTION_STORED,
    (response: ApiSanctionStoredEventResponse) => {
      const sanctionedPlayer = response.profile
        ? mapApiProfileToProfile(response.profile)
        : undefined

      toast.error(
        t(`sanctions.sanctioned.${response.sanction.severity}`, {
          name: getFullName(sanctionedPlayer) ?? response.team.name,
        }),
      )

      if (EXPULSION_SEVERITIES.includes(response.sanction.severity)) {
        const game = selectedDateGames.value?.find(
          game => game.currentSet?.id === response.sanction.set_id,
        )
        const call = calls.value.find(call => call.gameId === game?.id)
        const rotation = currentSetRotation(game?.id ?? 0, call?.id ?? 0)
        const inCourtPlayerIds = rotation?.players?.map(
          player => player.inCourtProfileId,
        )
        if (
          game &&
          call &&
          rotation &&
          sanctionedPlayer &&
          inCourtPlayerIds?.includes(sanctionedPlayer.id)
        ) {
          navigateTo(
            `/coach/games/${game.id}/teams/${call.teamId}/rotations/${rotation.id}/player-change`,
          )
        }
      }
    },
  )
}

const listenGameSignatureCreatedEvent = (gameId: number) => {
  listenedEvents.value.push(`game.${gameId}.game_signature.created`)
  window.Echo.channel(`game.${gameId}.game_signature.created`).listen(
    ApiEvents.GAME_SIGNATURE_CREATED,
    (response: ApiGameSignatureCreatedEventResponse) => {
      toast.info(t('reports.signed'))
      getGamesByDate()
    },
  )
}

const listenRequestChangeDateEvent = (gameId: number) => {
  listenedEvents.value.push(`game.${gameId}.request-change-date`)
  window.Echo.channel(`game.${gameId}.request-change-date`).listen(
    ApiEvents.REQUEST_CHANGE_DATE,
    (response: ApiRequestChangeDateEventResponse) => {
      if (response.emitter.id === auth.user?.id) return

      if (response.action === 'requested' && response.game.requested_date) {
        toast.info(
          t('events.date_change_requested', {
            gameName: response.game.name,
            date: formatDateByLocale(
              response.game.requested_date,
              locale.value,
            ),
          }),
        )
      } else if (response.action === 'approved' && response.game.date) {
        toast.info(
          t('events.date_change_approved', {
            gameName: response.game.name,
            date: formatDateByLocale(response.game.date, locale.value),
          }),
        )
      }

      getGamesByDate()
    },
  )
}

const listenAllChannels = (gameId: number) => {
  if (!listenedEvents.value.includes(`game.${gameId}.status.updated`)) {
    listenGameStatusUpdatedEvent(gameId)
  }
  if (!listenedEvents.value.includes(`game.${gameId}.timeout.status.updated`)) {
    listenTimeoutStatusUpdatedEvent(gameId)
  }
  if (!listenedEvents.value.includes(`game.${gameId}.sanction.stored`)) {
    listenSanctionStoredEvent(gameId)
  }
  if (!listenedEvents.value.includes(`game.${gameId}.game_signature.created`)) {
    listenGameSignatureCreatedEvent(gameId)
  }
  if (!listenedEvents.value.includes(`game.${gameId}.request-change-date`)) {
    listenRequestChangeDateEvent(gameId)
  }

  calls.value?.forEach(call => {
    if (
      !listenedEvents.value.includes(`game.${gameId}.call.${call.id}.unlocked`)
    ) {
      listenCallUnlockedEvent(gameId, call.id)
    }
    if (
      !listenedEvents.value.includes(
        `game.${gameId}.rotation.${call.currentRotation?.id}.lock-toggled`,
      )
    ) {
      listenRotationLockToggledEvent(gameId, call.currentRotation?.id)
    }
  })
}

const leaveAllChannels = () => {
  window.Echo.leaveAllChannels()
  listenedEvents.value = []
}

const handleDateChanged = (date: Date) => getGamesByDate(date)

const handleDateRequested = (game: Game) => {
  getGamesByDate(game.date)
}

const handleDateApproved = (game: Game) => {
  getGamesByDate(game.date)
}

onMounted(() => {
  leaveAllChannels()
  getGamesByDate()
})

onBeforeUnmount(() => {
  leaveAllChannels()
})
</script>

<template>
  <div class="easy-coach-panel-component flex flex-col">
    <Heading class="mb-5" position="center">
      {{
        auth.profile?.firstName
          ? t('coaches.welcome', { name: auth.profile.firstName })
          : t('coaches.welcome_no_name')
      }}
    </Heading>

    <EasyGrid class="mb-8" justify="center">
      <EasyCalendar @date:changed="handleDateChanged" />
    </EasyGrid>

    <LoadingLabel
      v-if="loadingApi"
      class="justify-center"
      :label="t('games.loading')"
    />
    <template v-else>
      <CoachGames
        v-if="selectedDateGames?.length"
        :games="selectedDateGames"
        :calls="calls"
        @date:requested="handleDateRequested"
        @date:approved="handleDateApproved"
        @timeout:requested="setTimeoutStatus"
        @countdown:ended="onCountdownEnded"
        @report:signed="onReportSigned"
      />
      <p v-else class="text-center">{{ t('games.no_games_for_date') }}</p>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CoachPanel',
}
</script>
