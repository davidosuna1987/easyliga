<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import TimeoutService from '@/services/timeout'
import {
  Game,
  GAME_OBSERVATIONS_DELAY,
  isMatchDay,
  isMatchDayPassed,
  isSameCoachForBothTeams,
} from '@/domain/game'
import {
  GameSignature,
  GameSignatureType,
  GameSignatureTypes,
} from '@/domain/game-signature'
import { Call, MIN_CALL_PLAYERS } from '@/domain/call'
import {
  Rotation,
  MAX_ROTATION_PLAYER_CHANGES,
  ROTATION_PLAYER_STATUS,
} from '@/domain/rotation'
import {
  Timeout,
  TimeoutStatusEnum,
  TimeoutStoreRequest,
  mapApiTimeoutToTimeout,
} from '@/domain/timeout'
import { SanctionType, EXPULSION_SEVERITIES } from '@/domain/sanction'
import { TeamType } from '@/domain/team'
import moment from 'moment'

const props = defineProps({
  games: {
    type: Array as PropType<Game[]>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'date:requested', value: Game): void
  (e: 'date:approved', value: Game): void
  (e: 'timeout:requested', value: Timeout): void
  (e: 'countdown:ended', value: { game: Game; call: Call }): void
  (e: 'signature:stored', value: GameSignature): void
}>()

const { t } = useI18n()
const auth = useAuthStore()
const toast = useEasyToast()

const timeoutService = new TimeoutService()

const ENABLE_TIMEOUT_REQUESTS = false

const getPlayingStatusGridCols = (game: Game) => {
  if (isSameCoachForBothTeams(game)) {
    return 2
  }

  return ENABLE_TIMEOUT_REQUESTS ? 2 : 1
}

const ACTIONS_GRID_COLS: Record<string, number> = {
  default: 1,
  warmup: 2,
  resting: 1,
  playing: ENABLE_TIMEOUT_REQUESTS ? 2 : 1,
  finished: 2,
  undefined: 1,
}

const showGameRequestDateIds = ref<number[]>([])

const gameSignatures = ref<GameSignature[]>(
  props.games.flatMap(game => game.signatures ?? []),
)
const setToRequestTimeout = ref<{ setId: number; teamId: number }>()
const loadingTimeout = ref<boolean>(false)

const getGameCall = (
  game: Game,
  opponent: boolean = false,
): Call | undefined => {
  const teamType =
    game.localTeam?.coachId === auth.user?.id
      ? opponent
        ? TeamType.VISITOR
        : TeamType.LOCAL
      : opponent
      ? TeamType.LOCAL
      : TeamType.VISITOR

  return game.calls?.find(call => call.teamId === game?.[`${teamType}TeamId`])
}

const gamesWithSanctionedMembersToChange = computed((): Game[] =>
  props.games.filter(game => {
    const teamRotations = game.currentSet?.rotations?.filter(rotation => {
      return isSameCoachForBothTeams(game)
        ? game.calls?.map(call => call.id).includes(rotation.callId)
        : rotation.callId === getGameCall(game)?.id
    })

    const inCourtProfileIds = teamRotations
      ?.flatMap(rotation => rotation.players)
      ?.map(player => player.inCourtProfileId)

    return game.currentSet?.sanctions?.some(
      sanction =>
        sanction.type === SanctionType.member &&
        EXPULSION_SEVERITIES.includes(sanction.severity) &&
        (isSameCoachForBothTeams(game)
          ? game.calls?.map(call => call.teamId).includes(sanction.teamId)
          : sanction.teamId === getGameCall(game)?.teamId) &&
        sanction.playerProfileId &&
        inCourtProfileIds?.includes(sanction.playerProfileId),
    )
  }),
)

const showCoachButtonChangeDate = (game: Game) =>
  game.date && !isMatchDayPassed(game)

const requestTimeout = async () => {
  const storeTimeoutForm: TimeoutStoreRequest = {
    setId: setToRequestTimeout.value?.setId ?? 0,
    teamId: setToRequestTimeout.value?.teamId ?? 0,
    status: TimeoutStatusEnum.requested,
  }

  setToRequestTimeout.value = undefined

  loadingTimeout.value = true
  const { data, error } = await timeoutService.store(storeTimeoutForm)
  loadingTimeout.value = false

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value?.data) {
    toast.success(t('timeouts.requested'))
    emit('timeout:requested', mapApiTimeoutToTimeout(data.value.data.timeout))
  }
}

const currentSetRotation = (
  game: Game,
  opponent: boolean = false,
): Rotation | undefined => {
  const call = getGameCall(game, opponent)
  return call
    ? game.currentSet?.rotations?.find(rotation => rotation.callId === call.id)
    : undefined
}

const callUnlocked = (game: Game, opponent: boolean = false): boolean => {
  const call = getGameCall(game, opponent)
  return call
    ? !call.locked || call.playersData.length < MIN_CALL_PLAYERS
    : true
}

const rotationLocked = (game: Game, opponent: boolean = false): boolean => {
  const call = getGameCall(game, opponent)
  return call ? !!call.currentRotation?.locked : true
}

const maxSetPlayerChangesReached = (
  game: Game,
  opponent: boolean = true,
): boolean | undefined => {
  const rotation = currentSetRotation(game, opponent)
  if (!rotation) return
  return rotation.playerChangesCount >= MAX_ROTATION_PLAYER_CHANGES
}

const currentSetRotationLocked = (
  game: Game,
  opponent: boolean = false,
): boolean => {
  const call = getGameCall(game, opponent)
  if (!call || !call.locked) return true
  return call
    ? !!call.locked && !!currentSetRotation(game, opponent)?.locked
    : true
}

const initialRotationAssigned = (game: Game, opponent: boolean = false) => {
  const rotation = currentSetRotation(game, opponent)
  return rotation?.players.length === 6
}

const currentSetHasPendingPlayerChanges = (
  game: Game,
  opponent: boolean = false,
): boolean => {
  const rotation = currentSetRotation(game, opponent)
  return !!rotation?.players.some(
    player => player.status === ROTATION_PLAYER_STATUS.pending,
  )
}

const showPendingPlayerChangesToast = () =>
  toast.warn(t('player_change_requests.changes_waiting_approval'))

const getGameObservationsCountdownTarget = (game: Game): number =>
  moment(game.end).add(GAME_OBSERVATIONS_DELAY, 'minutes').valueOf()

const onCountdownEnded = ({ game, call }: { game: Game; call: Call }) =>
  emit('countdown:ended', { game, call })

const redirectIfSanctionedMembersToChange = () => {
  if (gamesWithSanctionedMembersToChange.value.length) {
    gamesWithSanctionedMembersToChange.value.forEach(game => {
      const calls = game.calls?.filter(call => call.gameId === game.id)

      calls?.forEach(call => {
        const rotation = game.currentSet?.rotations?.find(
          rotation => rotation.callId === call?.id,
        )

        if (call && rotation) {
          navigateTo(
            `/coach/game/${game.id}/team/${call.teamId}/rotations/${rotation.id}/player-change`,
          )
        }
      })
    })
  }
}

const signButtonTypeDisabled = (
  game: Game,
  call: Call,
  signatureType: GameSignatureType,
): boolean => {
  return !!gameSignatures.value?.find(
    signature =>
      signature.gameId === game.id &&
      signature.type === signatureType &&
      signature.teamId === call.teamId,
  )
}

const reportAlreadySignedByCoachAndCaptain = (
  game: Game,
  call: Call,
): boolean => {
  const gameTeamSignatures = gameSignatures.value?.filter(
    signature =>
      signature.gameId === game.id && signature.teamId === call?.teamId,
  )

  return (
    gameTeamSignatures?.some(
      signature => signature.type === GameSignatureTypes.coach,
    ) &&
    gameTeamSignatures?.some(
      signature => signature.type === GameSignatureTypes.captain,
    )
  )
}

const gameCallSigned = (game: Game): boolean => {
  const callSigned = !!getGameCall(game)
    ? reportAlreadySignedByCoachAndCaptain(game, getGameCall(game) as Call)
    : false

  if (isSameCoachForBothTeams(game)) {
    const opponentCallSigned = !!getGameCall(game, true)
      ? reportAlreadySignedByCoachAndCaptain(
          game,
          getGameCall(game, true) as Call,
        )
      : false

    return callSigned && opponentCallSigned
  }

  return callSigned
}

const showReportSignedMessage = (game: Game, index: number): boolean =>
  isMatchDay(game) ? gameCallSigned(game) : game.status === 'finished'

const showSignatureCountdown = (game: Game, index: number): boolean =>
  game.status === 'finished' && !gameCallSigned(game)

const handleSignatureStored = (gameSignature: GameSignature) => {
  gameSignatures.value.push(gameSignature)
  emit('signature:stored', gameSignature)
}

const addGameToShowGameRequestDateIds = (gameId: number) => {
  if (showGameRequestDateIds.value.includes(gameId)) return
  showGameRequestDateIds.value = [...showGameRequestDateIds.value, gameId]
}

const removeGameFromShowGameRequestDateIds = (gameId: number) =>
  (showGameRequestDateIds.value = showGameRequestDateIds.value.filter(
    id => id !== gameId,
  ))

const isGameInShowGameRequestDateIds = (gameId: number): boolean =>
  showGameRequestDateIds.value.includes(gameId)

const handleCalendarShow = (game: Game) => {
  addGameToShowGameRequestDateIds(game.id)
  setTimeout(() => {
    const input = document.getElementById('calendar-game-date-input')
    input?.click()
  }, 100)
}

const handleDateRequested = (game: Game) => {
  emit('date:requested', game)
}

const handleDateApproved = (game: Game) => {
  emit('date:approved', game)
}

const handleTimeoutRequested = (setId?: number, teamId?: number) =>
  (setToRequestTimeout.value = setId && teamId ? { setId, teamId } : undefined)

const getActionsGridCols = (game: Game): number => {
  switch (game.status) {
    case 'playing':
      return getPlayingStatusGridCols(game)
    case 'resting':
      return isSameCoachForBothTeams(game) ? 2 : 1
    default:
      return ACTIONS_GRID_COLS[game.status ?? 'default']
  }
}

onMounted(() => redirectIfSanctionedMembersToChange())
</script>

<template>
  <div class="easy-coach-games-component">
    <div v-for="(game, index) in games" class="game">
      <header class="name text-center">{{ game.name }}</header>
      <GameStatus :status="game.status" :start="game.date" />

      <GameChangeDateStatus
        v-if="game.requestedDate && !game.status && !isMatchDayPassed(game)"
        class="mt-2"
        :game="game"
      />

      <EasyGrid class="actions mt-3" :gap="2" :cols="getActionsGridCols(game)">
        <template v-if="game.status">
          <template v-if="game.status === 'warmup'">
            <CoachButtonCall
              class="action"
              :gameId="game.id"
              :teamId="getGameCall(game)?.teamId ?? 0"
              :locked="!!getGameCall(game)?.locked"
            />
            <CoachButtonCall
              v-if="isSameCoachForBothTeams(game) && getGameCall(game, true)"
              class="action"
              :gameId="game.id"
              :teamId="getGameCall(game, true)?.teamId ?? 0"
              :locked="!!getGameCall(game, true)?.locked"
            />
          </template>
          <template v-if="['warmup', 'resting'].includes(game.status)">
            <CoachButtonRotation
              class="action"
              :gameId="game.id"
              :callId="getGameCall(game)?.id ?? 0"
              :rotationId="currentSetRotation(game)?.id ?? 0"
              :teamId="getGameCall(game)?.teamId ?? 0"
              :sanctionedPlayersToBeReplaced="
                gamesWithSanctionedMembersToChange.includes(game)
              "
              :callUnlocked="callUnlocked(game)"
              :locked="
                currentSetRotationLocked(game) || initialRotationAssigned(game)
              "
            />
            <CoachButtonRotation
              v-if="isSameCoachForBothTeams(game)"
              class="action"
              :gameId="game.id"
              :callId="getGameCall(game, true)?.id ?? 0"
              :rotationId="currentSetRotation(game, true)?.id ?? 0"
              :teamId="getGameCall(game, true)?.teamId ?? 0"
              :sanctionedPlayersToBeReplaced="
                gamesWithSanctionedMembersToChange.includes(game)
              "
              :callUnlocked="callUnlocked(game, true)"
              :locked="
                currentSetRotationLocked(game, true) ||
                initialRotationAssigned(game, true)
              "
            />
          </template>
          <template v-if="game.status === 'playing'">
            <CoachButtonPlayerChange
              v-if="!!getGameCall(game)"
              class="action"
              :gameId="game.id"
              :teamId="getGameCall(game)?.teamId ?? 0"
              :rotation="currentSetRotation(game)"
              :locked="
                !!rotationLocked(game) || !!maxSetPlayerChangesReached(game)
              "
              :showPendingStatus="currentSetHasPendingPlayerChanges(game)"
            />
            <CoachButtonPlayerChange
              v-if="isSameCoachForBothTeams(game) && !!getGameCall(game, true)"
              class="action"
              :gameId="game.id"
              :teamId="getGameCall(game, true)?.teamId ?? 0"
              :rotation="currentSetRotation(game, true)"
              :locked="
                !!rotationLocked(game, true) ||
                !!maxSetPlayerChangesReached(game, true)
              "
              :showPendingStatus="currentSetHasPendingPlayerChanges(game, true)"
            />
            <template v-if="ENABLE_TIMEOUT_REQUESTS">
              <CoachButtonTimeout
                v-if="!!getGameCall(game)"
                class="action"
                :game="game"
                :teamId="getGameCall(game)?.teamId ?? 0"
                :loading="loadingTimeout"
                @timeout:dialog="
                  handleTimeoutRequested($event, getGameCall(game)?.teamId)
                "
              />
              <CoachButtonTimeout
                v-if="
                  isSameCoachForBothTeams(game) && !!getGameCall(game, true)
                "
                class="action"
                :game="game"
                :teamId="getGameCall(game, true)?.teamId ?? 0"
                :loading="loadingTimeout"
                @timeout:dialog="
                  handleTimeoutRequested(
                    $event,
                    getGameCall(game, true)?.teamId,
                  )
                "
              />
            </template>
          </template>
          <template v-if="game.status === 'finished'">
            <div
              v-if="showReportSignedMessage(game, index)"
              :class="[
                `col-span-${
                  ACTIONS_GRID_COLS[game.status ?? 'default']
                } text-xs text-[var(--danger-color)] flex items-center justify-center`,
              ]"
            >
              <!-- {{ t('reports.closed') }} -->
              <Button
                :label="t('reports.show_game')"
                size="small"
                @click.prevent="navigateTo(`/games/${game.id}/report`)"
              />
            </div>
            <template v-else>
              <template
                v-for="gameSignatureType in [
                  GameSignatureTypes.coach,
                  GameSignatureTypes.captain,
                ]"
              >
                <CoachButtonSign
                  v-if="!!getGameCall(game)"
                  :game="game"
                  :call="getGameCall(game) as Call"
                  :signature-type="gameSignatureType"
                  :disabled="
                    signButtonTypeDisabled(
                      game,
                      getGameCall(game) as Call,
                      gameSignatureType,
                    )
                  "
                  @signature:stored="handleSignatureStored"
                />
                <CoachButtonSign
                  v-if="
                    isSameCoachForBothTeams(game) && !!getGameCall(game, true)
                  "
                  :game="game"
                  :call="getGameCall(game, true) as Call"
                  :signature-type="gameSignatureType"
                  :disabled="
                    signButtonTypeDisabled(
                      game,
                      getGameCall(game, true) as Call,
                      gameSignatureType,
                    )
                  "
                  @signature:stored="handleSignatureStored"
                />
              </template>
            </template>
          </template>
        </template>

        <CoachButtonChangeDate
          v-else-if="showCoachButtonChangeDate(game)"
          :game="game"
          :showCalendar="isGameInShowGameRequestDateIds(game.id)"
          @hide="removeGameFromShowGameRequestDateIds(game.id)"
          @calendar:show="handleCalendarShow(game)"
          @date:requested="handleDateRequested(game)"
          @date:approved="handleDateApproved(game)"
        />
      </EasyGrid>

      <EasyCountdown
        v-if="showSignatureCountdown(game, index)"
        :class="[
          `col-span-${ACTIONS_GRID_COLS[game.status ?? 'default']} mt-3`,
        ]"
        v-slot="{ minutes, seconds }"
        :target="getGameObservationsCountdownTarget(game)"
        @countdown:ended="
          onCountdownEnded({ game, call: getGameCall(game) as Call })
        "
      >
        <div
          class="text-xs text-[var(--danger-color)] flex items-center justify-center"
        >
          {{ t('reports.countdown') }}
          <pre class="text-xs ml-2">{{ minutes }}:{{ seconds }}</pre>
        </div>
      </EasyCountdown>
    </div>

    <DialogBottom
      class="easy-coach-timeout-request-dialog-component"
      :visible="!!setToRequestTimeout"
      @hide="setToRequestTimeout = undefined"
    >
      <template #header>
        <Heading tag="h6">{{ t('timeouts.request') }}</Heading>
      </template>

      <p>{{ t('timeouts.request_alert') }}</p>

      <template #stickyFooter>
        <FormFooterActions
          :submitLabel="t('forms.request')"
          @form:submit="requestTimeout"
          @form:cancel="setToRequestTimeout = undefined"
        />
      </template>
    </DialogBottom>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CoachGames',
}
</script>
