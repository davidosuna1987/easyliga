<script lang="ts" setup>
import GameService from '@/services/game'
import PointService from '@/services/point'
import SetService from '@/services/set'
import { GameInitialData, mapApiGameInitialDataToGame } from '@/domain/game'
import { Call, mapApiCallToCall } from '@/domain/call'
import { ApiErrorObject } from '@/types/errors'
import { ApiCallUpdatedEventResponse } from '@/types/api/call'
import { ApiRotationCreatedEventResponse } from '@/types/api/rotation'
import { TeamType } from '@/domain/team'
import { Point } from '@/domain/point'
import { ApiPointStoreRequest } from '@/types/api/point'
import {
  SetStartRequest,
  mapSetStartRequestToApiSetStartRequest,
} from '@/domain/set'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
const app = useNuxtApp()
const route = useRoute()
const toast = useEasyToast()
const gameService = new GameService()
const pointService = new PointService()
const setService = new SetService()

const gameInitialData = ref<GameInitialData>()
const localTeamCall = ref<Call>()
const visitorTeamCall = ref<Call>()
const lastPoint = ref<Point>()
const undoPointButtonDisabled = ref<boolean>(true)
const undoLastPointCountdown = ref<number>(0)
const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject | null>(null)

const disablePointTimeout = ref<boolean>(true)

const pointTimeout = ref<NodeJS.Timeout>()
const pointInterval = ref<NodeJS.Timeout>()

const formPoint = ref<ApiPointStoreRequest>()

const leftSideTeam = computed(() => {
  return !gameInitialData.value?.game.currentSet?.localTeamSide ||
    gameInitialData.value?.game.currentSet?.localTeamSide === 'left'
    ? gameInitialData.value?.localTeam
    : gameInitialData.value?.visitorTeam
})

const rightSideTeam = computed(() => {
  return !gameInitialData.value?.game.currentSet?.visitorTeamSide ||
    gameInitialData.value?.game.currentSet?.visitorTeamSide === 'right'
    ? gameInitialData.value?.visitorTeam
    : gameInitialData.value?.localTeam
})

const leftSideTeamCall = computed(() =>
  localTeamCall.value?.teamId === leftSideTeam.value?.id
    ? localTeamCall.value
    : visitorTeamCall.value,
)

const rightSideTeamCall = computed(() =>
  visitorTeamCall.value?.teamId === rightSideTeam.value?.id
    ? visitorTeamCall.value
    : localTeamCall.value,
)

const leftSideTeamRotation = computed(() => {
  return !gameInitialData.value?.game.currentSet?.localTeamSide ||
    gameInitialData.value?.game.currentSet?.localTeamSide === 'left'
    ? gameInitialData.value?.localTeamRotation
    : gameInitialData.value?.visitorTeamRotation
})

const rightSideTeamRotation = computed(() => {
  return !gameInitialData.value?.game.currentSet?.visitorTeamSide ||
    gameInitialData.value?.game.currentSet?.visitorTeamSide === 'right'
    ? gameInitialData.value?.visitorTeamRotation
    : gameInitialData.value?.localTeamRotation
})

const servingTeamId = computed(() => {
  return lastPoint.value
    ? lastPoint.value?.winnerTeamId
    : gameInitialData.value?.game?.currentSet?.firstServeTeamId ?? undefined
})

const getGameInitialData = async () => {
  loadingApi.value = true
  const { data, error } = await gameService.initialData(
    Number(route.params.game_id),
    {
      with: 'currentSet',
    },
  )

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors))
    errors.value = error.value?.data?.errors
    return
  }

  gameInitialData.value = mapApiGameInitialDataToGame(data.value)
  lastPoint.value = gameInitialData.value?.game.currentSet?.lastPoint
  localTeamCall.value = gameInitialData.value?.calls?.find(
    call => call.teamId === gameInitialData.value?.localTeam?.id,
  )
  visitorTeamCall.value = gameInitialData.value?.calls?.find(
    call => call.teamId === gameInitialData.value?.visitorTeam?.id,
  )
  loadingApi.value = false
}

const sumPoint = async (type: TeamType) => {
  loadingApi.value = true

  createFormPoint(type)

  if (formPoint.value) {
    const { error } = await pointService.store(formPoint.value)

    if (error.value) {
      toast.mapError(Object.values(error.value?.data?.errors))
      loadingApi.value = false
      return
    } else {
      toast.success(useNuxtApp().$i18n.t('points.added'))
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
    toast.success(useNuxtApp().$i18n.t('points.deleted'))
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

const createFormPoint = (type?: TeamType) => {
  console.log(type)
  if (!gameInitialData.value?.game.currentSet) return

  formPoint.value = {
    set_id: gameInitialData.value.game.currentSet.id,
    previous_point_id: lastPoint.value?.id ?? null,
    serving_team_id: servingTeamId.value as number,
    serving_profile_id: null,
    scoring_profile_id: null,
    winner_team_id:
      type === 'local'
        ? gameInitialData.value.localTeam.id
        : gameInitialData.value.visitorTeam.id,
    loser_team_id:
      type === 'local'
        ? gameInitialData.value.visitorTeam.id
        : gameInitialData.value.localTeam.id,
    local_team_score:
      type === 'local'
        ? Number(lastPoint.value?.localTeamScore ?? 0) + 1
        : Number(lastPoint.value?.localTeamScore ?? 0),
    visitor_team_score:
      type === 'visitor'
        ? Number(lastPoint.value?.visitorTeamScore ?? 0) + 1
        : Number(lastPoint.value?.visitorTeamScore ?? 0),
    comments: null,
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
    toast.success(useNuxtApp().$i18n.t('sets.started'))
    getGameInitialData()
  }
}

const listenCallUpdatedEvent = () => {
  window.Echo.channel(`game.${route.params.game_id}.call.updated`).listen(
    'CallUpdatedEvent',
    (response: ApiCallUpdatedEventResponse) => {
      toast.info(
        app.$i18n.t('events.call_updated', {
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
        app.$i18n.t('events.rotation_created', {
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
      v-if="leftSideTeam && rightSideTeam"
      :leftSideTeam="leftSideTeam"
      :rightSideTeam="rightSideTeam"
    />
    <RefereeGameSidebarsCourt
      v-if="
        leftSideTeam &&
        rightSideTeam &&
        leftSideTeamCall &&
        rightSideTeamCall &&
        gameInitialData &&
        gameInitialData.game.currentSet &&
        leftSideTeamRotation &&
        rightSideTeamRotation
      "
      :leftSideTeam="leftSideTeam"
      :rightSideTeam="rightSideTeam"
      :leftSideTeamCall="leftSideTeamCall"
      :rightSideTeamCall="rightSideTeamCall"
      :currentSet="gameInitialData.game.currentSet"
      :leftSideTeamRotation="leftSideTeamRotation"
      :rightSideTeamRotation="rightSideTeamRotation"
      :undoPointButtonDisabled="undoPointButtonDisabled"
      :undoLastPointCountdown="undoLastPointCountdown"
      :servingTeamId="servingTeamId"
      @unlocked:call="getGameInitialData"
      @point:sum="sumPoint"
      @point:undo="undoLastPoint"
      @set:start="startSet"
    />

    <div v-if="auth.hasRole('staff')" class="flex items-center mt-5">
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
