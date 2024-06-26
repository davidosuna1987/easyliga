<script lang="ts" setup>
import GameService from '@/services/game'
import PointService from '@/services/point'
import SetService from '@/services/set'
import TimeoutService from '@/services/timeout'
import {
  GameInitialData,
  GameObservationsRequest,
  mapApiGameInitialDataToGameInitialData,
} from '@/domain/game'
import { Call, mapApiCallToCall } from '@/domain/call'
import { ApiErrorObject } from '@/types/errors'
import {
  ApiCallUpdatedEventResponse,
  ApiGameSignatureCreatedEventResponse,
  ApiRotationCreatedEventResponse,
  ApiRotationUpdatedEventResponse,
  ApiTimeoutStatusUpdatedEventResponse,
} from '@/types/api/event'
import {
  CustomTeamsShirtColor,
  ShirtColor,
  Team,
  TeamType,
} from '@/domain/team'
import { Point } from '@/domain/point'
import { ApiPointStoreRequest } from '@/types/api/point'
import {
  LAST_SET_POINTS_TO_WIN,
  MAX_SETS_PER_MATCH,
  POINT_DIFFERENCE_TO_WIN,
  SET_POINTS_TO_WIN,
  SetSide,
  SetStartRequest,
  mapSetStartRequestToApiSetStartRequest,
} from '@/domain/set'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  CurrentRotation,
  Rotation,
  mapApiRotationToRotation,
} from '@/domain/rotation'
import { ApiEvents } from '@/types/api/event'
import {
  Timeout,
  TimeoutStatus,
  TimeoutStatusEnum,
  mapApiTimeoutToTimeout,
} from '@/domain/timeout'
import { Sanction, SanctionSeverity } from '@/domain/sanction'
import {
  GameSignatureTypes,
  mapApiGameSignatureToGameSignature,
} from '@/domain/game-signature'
import { User } from '@/domain/user'

const { t } = useI18n()
const auth = useAuthStore()
const route = useRoute()
const toast = useEasyToast()

const gameService = new GameService()
const pointService = new PointService()
const setService = new SetService()
const timeoutService = new TimeoutService()

const gameInitialData = ref<GameInitialData>()
const localTeamCall = ref<Call>()
const visitorTeamCall = ref<Call>()
const lastPoint = ref<Point>()
const observationsForm = ref<GameObservationsRequest>({
  observations: undefined,
})
const undoPointButtonDisabled = ref<boolean>(true)
const undoLastPointCountdown = ref<number>(0)
const showObservationsDialog = ref<boolean>(false)
const showShirtColorDialogWithTeam = ref<Team>()
const loadingApi = ref<boolean>(false)
const loadingTimeout = ref<boolean>(false)
const loadingObservations = ref<boolean>(false)
const errors = ref<ApiErrorObject | null>(null)

const disablePointTimeout = ref<boolean>(true)

const pointTimeout = ref<NodeJS.Timeout>()
const pointInterval = ref<NodeJS.Timeout>()

const formPoint = ref<ApiPointStoreRequest>()
const showSetPointWillEndSetDialog = ref<boolean>()

const customTeamsShirtColor = ref<CustomTeamsShirtColor>({
  left: undefined,
  right: undefined,
})

const leftSideTeam = computed((): Team | undefined =>
  !gameInitialData.value?.game.currentSet?.localTeamSide ||
  gameInitialData.value?.game.currentSet?.localTeamSide === SetSide.LEFT
    ? gameInitialData.value?.localTeam
    : gameInitialData.value?.visitorTeam,
)

const rightSideTeam = computed((): Team | undefined =>
  !gameInitialData.value?.game.currentSet?.visitorTeamSide ||
  gameInitialData.value?.game.currentSet?.visitorTeamSide === SetSide.RIGHT
    ? gameInitialData.value?.visitorTeam
    : gameInitialData.value?.localTeam,
)

const leftSideTeamCoach = computed(
  (): User | undefined => leftSideTeam.value?.coach,
)

const rightSideTeamCoach = computed(
  (): User | undefined => rightSideTeam.value?.coach,
)

const leftSideTeamCall = computed((): Call | undefined =>
  localTeamCall.value?.teamId === leftSideTeam.value?.id
    ? localTeamCall.value
    : visitorTeamCall.value,
)

const rightSideTeamCall = computed((): Call | undefined =>
  visitorTeamCall.value?.teamId === rightSideTeam.value?.id
    ? visitorTeamCall.value
    : localTeamCall.value,
)

const leftSideTeamRotation = computed((): Rotation | undefined =>
  gameInitialData.value?.game.currentSet?.rotations?.find(
    rotation => rotation.callId === leftSideTeamCall.value?.id,
  ),
)

const rightSideTeamRotation = computed((): Rotation | undefined =>
  gameInitialData.value?.game.currentSet?.rotations?.find(
    rotation => rotation.callId === rightSideTeamCall.value?.id,
  ),
)

const leftSideTeamCurrentRotation = computed(
  (): CurrentRotation | undefined => {
    return !gameInitialData.value?.game.currentSet?.localTeamSide ||
      gameInitialData.value?.game.currentSet?.localTeamSide === SetSide.LEFT
      ? gameInitialData.value?.localTeamRotation
      : gameInitialData.value?.visitorTeamRotation
  },
)

const rightSideTeamCurrentRotation = computed(
  (): CurrentRotation | undefined => {
    return !gameInitialData.value?.game.currentSet?.visitorTeamSide ||
      gameInitialData.value?.game.currentSet?.visitorTeamSide === SetSide.RIGHT
      ? gameInitialData.value?.visitorTeamRotation
      : gameInitialData.value?.localTeamRotation
  },
)

const leftSideTeamTimeouts = computed((): Timeout[] | undefined =>
  gameInitialData.value?.game.currentSet?.timeouts?.filter(
    timeout => timeout.teamId === leftSideTeam.value?.id,
  ),
)

const rightSideTeamTimeouts = computed((): Timeout[] | undefined =>
  gameInitialData.value?.game.currentSet?.timeouts?.filter(
    timeout => timeout.teamId === rightSideTeam.value?.id,
  ),
)

const timeoutRunning = computed(
  (): boolean =>
    !!loadingTimeout.value ||
    !!gameInitialData.value?.game.currentSet?.timeouts?.some(
      timeout => timeout.status === TimeoutStatusEnum.running,
    ),
)

const gameSanctions = computed(
  (): Sanction[] =>
    gameInitialData.value?.game?.sanctions?.filter(
      sanction => sanction.severity === SanctionSeverity.game,
    ) ?? [],
)

const leftSideTeamSetsWonCount = computed((): number =>
  localTeamCall.value?.teamId === leftSideTeam.value?.id
    ? gameInitialData.value?.localTeamSetsWonCount ?? 0
    : gameInitialData.value?.visitorTeamSetsWonCount ?? 0,
)

const rightSideTeamSetsWonCount = computed((): number =>
  visitorTeamCall.value?.teamId === rightSideTeam.value?.id
    ? gameInitialData.value?.visitorTeamSetsWonCount ?? 0
    : gameInitialData.value?.localTeamSetsWonCount ?? 0,
)

const servingTeamId = computed((): number | undefined =>
  lastPoint.value
    ? lastPoint.value?.winnerTeamId ?? undefined
    : gameInitialData.value?.game?.currentSet?.firstServeTeamId ?? undefined,
)

const winnerTeamIfSumPoint = computed((): Team | undefined => {
  if (!formPoint.value || !gameInitialData.value?.game) return undefined

  const game = gameInitialData.value.game

  const winnerTeamId = formPoint.value.winner_team_id
  const winnerTeam =
    winnerTeamId === leftSideTeam.value?.id ? leftSideTeam : rightSideTeam

  const localTeamId = game.localTeamId

  const winnerTeamScore =
    winnerTeamId === localTeamId
      ? formPoint.value.local_team_score
      : formPoint.value.visitor_team_score

  const loserTeamScore =
    winnerTeamId === localTeamId
      ? formPoint.value.visitor_team_score
      : formPoint.value.local_team_score

  const pointsToWin =
    game.currentSet?.number === MAX_SETS_PER_MATCH
      ? LAST_SET_POINTS_TO_WIN
      : SET_POINTS_TO_WIN

  if (
    winnerTeamScore >= pointsToWin &&
    winnerTeamScore - loserTeamScore >= POINT_DIFFERENCE_TO_WIN
  ) {
    return winnerTeam.value
  }

  return undefined
})

const getGameInitialData = async (firstCall: boolean = false) => {
  loadingApi.value = true
  const { data, error } = await gameService.initialData(
    Number(route.params.game_id),
    {
      with: 'sanctions,currentSet.rotations.players,currentSet.sanctions,currentSet.timeouts,signatures',
    },
  )

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    errors.value = error.value?.data?.errors
    return
  }

  gameInitialData.value = mapApiGameInitialDataToGameInitialData(data.value)
  lastPoint.value = gameInitialData.value?.game.currentSet?.lastPoint
  localTeamCall.value = gameInitialData.value?.calls?.find(
    call => call.teamId === gameInitialData.value?.localTeam?.id,
  )
  visitorTeamCall.value = gameInitialData.value?.calls?.find(
    call => call.teamId === gameInitialData.value?.visitorTeam?.id,
  )
  observationsForm.value.observations =
    gameInitialData.value.game.observations ?? undefined
  loadingApi.value = false

  if (firstCall) {
    window.Echo.leaveAllChannels()
    listenEvents()
  }
}

const sumPoint = async () => {
  if (!formPoint.value) return

  if (showSetPointWillEndSetDialog.value) {
    showSetPointWillEndSetDialog.value = false
  }

  loadingApi.value = true

  if (formPoint.value) {
    const { error } = await pointService.store(formPoint.value)

    if (error.value) {
      toast.mapError(Object.values(error.value?.data?.errors))
      loadingApi.value = false
      return
    } else {
      toast.success(t('points.added'), {
        life: 3000,
      })
      await getGameInitialData()
    }

    if (!disablePointTimeout.value) {
      const delay = 10000
      undoPointButtonDisabled.value = false
      undoLastPointCountdown.value = delay / 1000

      pointInterval.value = setInterval(() => {
        if (undoLastPointCountdown.value > 0) {
          undoLastPointCountdown.value = undoLastPointCountdown.value - 1
        } else {
          resetPointInterval()
        }
      }, 1000)

      pointTimeout.value = setTimeout(() => {
        resetPointInterval()
      }, delay)
    }

    formPoint.value = undefined
  }
}

const undoLastPoint = async () => {
  if (undoPointButtonDisabled.value === true) return

  loadingApi.value = true

  const { error } = await pointService.destroy(lastPoint.value?.id as number)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors))
    loadingApi.value = false
  } else {
    toast.success(t('points.deleted'))
    resetPointInterval()
    getGameInitialData()
  }
}

const resetPointInterval = () => {
  undoPointButtonDisabled.value = true
  undoLastPointCountdown.value = 0
  formPoint.value = undefined
  clearInterval(pointInterval.value)
  clearTimeout(pointTimeout.value)
}

const createFormPoint = (type: TeamType) => {
  if (!gameInitialData.value?.game.currentSet) return

  formPoint.value = {
    set_id: gameInitialData.value.game.currentSet.id,
    previous_point_id: lastPoint.value?.id ?? null,
    serving_team_id: servingTeamId.value as number,
    serving_profile_id: null,
    scoring_profile_id: null,
    winner_team_id:
      type === TeamType.LOCAL
        ? gameInitialData.value.localTeam.id
        : gameInitialData.value.visitorTeam.id,
    loser_team_id:
      type === TeamType.LOCAL
        ? gameInitialData.value.visitorTeam.id
        : gameInitialData.value.localTeam.id,
    local_team_score:
      type === TeamType.LOCAL
        ? Number(lastPoint.value?.localTeamScore ?? 0) + 1
        : Number(lastPoint.value?.localTeamScore ?? 0),
    visitor_team_score:
      type === TeamType.VISITOR
        ? Number(lastPoint.value?.visitorTeamScore ?? 0) + 1
        : Number(lastPoint.value?.visitorTeamScore ?? 0),
    observations: null,
  }

  if (winnerTeamIfSumPoint.value) {
    showSetPointWillEndSetDialog.value = true
  } else {
    sumPoint()
  }
}

const startSet = async (setStartRequest: SetStartRequest) => {
  if (!gameInitialData.value?.game?.currentSet?.id) return

  loadingApi.value = true

  const { error } = await setService.start(
    gameInitialData.value.game.currentSet.id,
    mapSetStartRequestToApiSetStartRequest(setStartRequest),
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    loadingApi.value = false
  } else {
    toast.success(t('sets.started'))
    getGameInitialData()
  }
}

const startTimeout = async (timeout: Timeout) => {
  loadingTimeout.value = true

  const { error } = await timeoutService.update(timeout.id, {
    status: TimeoutStatusEnum.running,
  })

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  }

  loadingTimeout.value = false
}

const addTimeout = (timeout: Timeout) => {
  if (!gameInitialData.value?.game.currentSet?.timeouts) return
  gameInitialData.value.game.currentSet.timeouts.push(timeout)
}

const showTimeoutStatusUpdatedToast = (
  status: TimeoutStatus,
  teamName: string,
) => {
  if (status === TimeoutStatusEnum.requested) {
    toast.info(
      t('events.timeout_status_requested_team', {
        teamName: teamName,
      }),
      {
        life: 20000,
      },
    )
  }
  if (status === TimeoutStatusEnum.running) {
    toast.info(t('events.timeout_status_running'))
  }
  if (status === TimeoutStatusEnum.finished) {
    toast.info(t('events.timeout_status_finished'))
  }
}

const setObservations = (observations?: string) =>
  (observationsForm.value.observations = observations)

const submitObservations = async () => {
  loadingObservations.value = true
  const { data, error } = await gameService.observations(
    Number(route.params.game_id),
    observationsForm.value,
  )
  loadingObservations.value = false

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    return
  }

  toast.success(t('observations.stored'))

  showObservationsDialog.value = false
}

const handleTeamShirtColorSelected = (shirtColor: ShirtColor) => {
  if (!showShirtColorDialogWithTeam.value) return

  setCustomTeamsShirtColor(showShirtColorDialogWithTeam.value.id, shirtColor)

  showShirtColorDialogWithTeam.value = undefined
}

const setCustomTeamsShirtColor = (teamId?: number, shirtColor?: ShirtColor) => {
  if (!leftSideTeam.value || !rightSideTeam.value) return

  const leftSideTeamShirtColor =
    teamId === leftSideTeam.value.id
      ? shirtColor
      : customTeamsShirtColor.value.left
      ? customTeamsShirtColor.value.left
      : leftSideTeam.value.shirtColor

  const rightSideTeamShirtColor =
    teamId === rightSideTeam.value.id
      ? shirtColor
      : customTeamsShirtColor.value.right
      ? customTeamsShirtColor.value.right
      : rightSideTeam.value.shirtColor

  customTeamsShirtColor.value = {
    left: leftSideTeamShirtColor,
    right: rightSideTeamShirtColor,
  }
}

const listenCallUpdatedEvent = () => {
  window.Echo.channel(`game.${route.params.game_id}.call.updated`).listen(
    ApiEvents.CALL_UPDATED,
    (response: ApiCallUpdatedEventResponse) => {
      toast.info(
        t('events.call_updated', {
          teamName: response.team.name,
        }),
        {
          life: 30000,
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
    ApiEvents.ROTATION_CREATED,
    (response: ApiRotationCreatedEventResponse) => {
      toast.info(
        t('events.rotation_created', {
          teamName: response.team.name,
        }),
        {
          life: 30000,
        },
      )

      const oldRotation =
        gameInitialData.value?.game.currentSet?.rotations?.find(
          rotation => rotation.callId === response.call.id,
        )

      if (oldRotation) {
        gameInitialData.value?.game.currentSet?.rotations?.splice(
          gameInitialData.value?.game.currentSet?.rotations
            ?.map(rotation => rotation.id)
            .indexOf(oldRotation.id),
          1,
        )
      }

      const newRotation = mapApiRotationToRotation(response.rotation)
      gameInitialData.value?.game.currentSet?.rotations?.push(newRotation)
    },
  )
}

const listenRotationUpdatedEvent = () => {
  window.Echo.channel(`game.${route.params.game_id}.rotation.updated`).listen(
    ApiEvents.ROTATION_UPDATED,
    (response: ApiRotationUpdatedEventResponse) => {
      toast.info(
        t('events.rotation_updated', {
          teamName: response.team.name,
        }),
        {
          life: 30000,
        },
      )

      const oldRotation =
        gameInitialData.value?.game.currentSet?.rotations?.find(
          rotation => rotation.id === response.rotation.id,
        )

      if (oldRotation) {
        gameInitialData.value?.game.currentSet?.rotations?.splice(
          gameInitialData.value?.game.currentSet?.rotations
            ?.map(rotation => rotation.id)
            .indexOf(oldRotation.id),
          1,
        )
      }

      const newRotation = mapApiRotationToRotation(response.rotation)
      gameInitialData.value?.game.currentSet?.rotations?.push(newRotation)
    },
  )
}

const listenTimeoutStatusUpdatedEvent = () => {
  window.Echo.channel(
    `game.${route.params.game_id}.timeout.status.updated`,
  ).listen(
    ApiEvents.TIMEOUT_STATUS_UPDATED,
    (response: ApiTimeoutStatusUpdatedEventResponse) => {
      showTimeoutStatusUpdatedToast(response.timeout.status, response.team.name)

      const oldTimeout = gameInitialData.value?.game.currentSet?.timeouts?.find(
        timeout => timeout.id === response.timeout.id,
      )

      if (oldTimeout) {
        gameInitialData.value?.game.currentSet?.timeouts?.splice(
          gameInitialData.value?.game.currentSet?.timeouts
            ?.map(timeout => timeout.id)
            .indexOf(oldTimeout.id),
          1,
        )
      }

      const newTimeout = mapApiTimeoutToTimeout(response.timeout)
      gameInitialData.value?.game.currentSet?.timeouts?.push(newTimeout)

      if (gameInitialData.value) {
        if (response.timeout.status === TimeoutStatusEnum.running) {
          gameInitialData.value.game.status = 'timeout'
        }
        if (response.timeout.status === 'finished') {
          gameInitialData.value.game.status = 'playing'
        }
      }
    },
  )
}

const listenGameSignatureCreatedEvent = () => {
  window.Echo.channel(
    `game.${route.params.game_id}.game_signature.created`,
  ).listen(
    ApiEvents.GAME_SIGNATURE_CREATED,
    (response: ApiGameSignatureCreatedEventResponse) => {
      const newSignature = mapApiGameSignatureToGameSignature(
        response.game_signature,
      )
      toast.info(
        t(
          `events.game_signature_created.${newSignature.type}`,
          newSignature.type !== GameSignatureTypes.referee
            ? { teamName: response.team.name }
            : {},
        ),
      )
      gameInitialData.value?.game.signatures?.push(newSignature)
    },
  )
}

const listenEvents = () => {
  listenCallUpdatedEvent()
  listenRotationCreatedEvent()
  listenRotationUpdatedEvent()
  listenTimeoutStatusUpdatedEvent()
  listenGameSignatureCreatedEvent()
}

watch(gameInitialData, () => setCustomTeamsShirtColor())

onMounted(() => {
  getGameInitialData(true)
})
</script>

<template>
  <div
    :class="[
      'easy-referee-game-arbitrate-component',
      gameInitialData?.game.status ? `is-${gameInitialData.game.status}` : '',
    ]"
  >
    <Loading v-if="loadingApi" />

    <GameStatus v-if="gameInitialData" :status="gameInitialData.game.status" />
    <GameScore
      v-if="gameInitialData?.game.currentSet"
      :currentSet="gameInitialData.game.currentSet"
      :leftSideTeamSetsWonCount="leftSideTeamSetsWonCount"
      :rightSideTeamSetsWonCount="rightSideTeamSetsWonCount"
    />
    <RefereeGameSidedTeamNames
      v-if="leftSideTeam && rightSideTeam"
      :leftSideTeam="leftSideTeam"
      :rightSideTeam="rightSideTeam"
      :customTeamsShirtColor="customTeamsShirtColor"
      @shirtColorDialog:open="showShirtColorDialogWithTeam = $event"
    />
    <RefereeGameSidebarsCourt
      v-if="
        leftSideTeam &&
        rightSideTeam &&
        leftSideTeamCall &&
        rightSideTeamCall &&
        gameInitialData &&
        gameInitialData.game &&
        gameInitialData.game.currentSet &&
        leftSideTeamCurrentRotation &&
        rightSideTeamCurrentRotation &&
        gameInitialData.game.currentSet.rotations &&
        gameInitialData.game.signatures
      "
      :game="gameInitialData.game"
      :leftSideTeam="leftSideTeam"
      :rightSideTeam="rightSideTeam"
      :leftSideTeamCoach="leftSideTeamCoach"
      :rightSideTeamCoach="rightSideTeamCoach"
      :leftSideTeamCall="leftSideTeamCall"
      :rightSideTeamCall="rightSideTeamCall"
      :currentSet="gameInitialData.game.currentSet"
      :gameSanctions="gameSanctions"
      :leftSideTeamRotation="leftSideTeamRotation"
      :rightSideTeamRotation="rightSideTeamRotation"
      :leftSideTeamCurrentRotation="leftSideTeamCurrentRotation"
      :rightSideTeamCurrentRotation="rightSideTeamCurrentRotation"
      :leftSideTeamTimeouts="leftSideTeamTimeouts"
      :rightSideTeamTimeouts="rightSideTeamTimeouts"
      :undoPointButtonDisabled="undoPointButtonDisabled"
      :undoLastPointCountdown="undoLastPointCountdown"
      :servingTeamId="servingTeamId"
      :rotations="gameInitialData.game.currentSet.rotations"
      :gameStatus="gameInitialData.game.status"
      :gameEndedAt="gameInitialData.game.end ?? undefined"
      :timeoutRunning="timeoutRunning"
      :gameSignatures="gameInitialData.game.signatures"
      :customTeamsShirtColor="customTeamsShirtColor"
      @call:unlocked="getGameInitialData"
      @rotation:lock-toggled="getGameInitialData"
      @point:sum="createFormPoint"
      @point:undo="undoLastPoint"
      @set:start="startSet"
      @timeout:start="startTimeout"
      @observations:dialog="showObservationsDialog = true"
      @timeout:init="addTimeout"
      @sanction:stored="getGameInitialData"
    />

    <ObservationsDialog
      :visible="!!showObservationsDialog"
      :observations="observationsForm.observations"
      :submitLabel="t('forms.store')"
      :loading="loadingObservations"
      @hide="showObservationsDialog = false"
      @observations:changed="setObservations"
      @observations:submit="submitObservations"
    />

    <TeamShirtColorDialog
      v-if="showShirtColorDialogWithTeam"
      :visible="!!showShirtColorDialogWithTeam"
      :teamName="showShirtColorDialogWithTeam.name"
      :shirtColor="showShirtColorDialogWithTeam.shirtColor"
      @hide="showShirtColorDialogWithTeam = undefined"
      @selected="handleTeamShirtColorSelected"
    />

    <DialogBottom
      class="easy-observations-dialog-component"
      :visible="!!showSetPointWillEndSetDialog"
      @hide="showSetPointWillEndSetDialog = false"
    >
      <template #header>
        <Heading tag="h6">{{ t('sets.close') }}</Heading>
      </template>

      <p>
        {{
          t('games.point_will_end_set', {
            teamName: winnerTeamIfSumPoint?.name,
          })
        }}
      </p>

      <p class="mt-3">{{ t('games.point_will_end_set_alert') }}</p>

      <template #footer>
        <FormFooterActions
          :submitLabel="t('forms.accept')"
          @form:submit="sumPoint"
          @form:cancel="showSetPointWillEndSetDialog = false"
        />
      </template>
    </DialogBottom>

    <!-- TODO: remove in production -->
    <div v-if="auth.isAdminOrHasRole('staff')" class="flex items-center mt-5">
      <label for="disablePointTimeout" class="mr-2 cursor-pointer">
        Deshabilitar tiempo de deshabilitar punto:
      </label>
      <Checkbox
        v-model="disablePointTimeout"
        binary
        inputId="disablePointTimeout"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameArbitrate',
}
</script>
