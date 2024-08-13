<script setup lang="ts">
import TimeoutService from '@/services/timeout'
import {
  Game,
  GAME_OBSERVATIONS_DELAY,
  isMatchDayPassed,
  isSameCoachForBothTeams,
} from '@/domain/game'
import {
  GameSignature,
  GameSignatureType,
  GameSignatureTypes,
} from '@/domain/game-signature'
import { Call, MIN_CALL_PLAYERS } from '@/domain/call'
import { Rotation, MAX_ROTATION_PLAYER_CHANGES } from '@/domain/rotation'
import {
  Timeout,
  TimeoutStatusEnum,
  TimeoutStoreRequest,
  mapApiTimeoutToTimeout,
} from '@/domain/timeout'
import { SanctionType, EXPULSION_SEVERITIES } from '@/domain/sanction'
import moment from 'moment'

const props = defineProps({
  games: {
    type: Array as PropType<Game[]>,
    required: true,
  },
  calls: {
    type: Array as PropType<Call[]>,
    required: true,
  },
  opponentCalls: {
    type: Array as PropType<Call[]>,
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
const toast = useEasyToast()

const timeoutService = new TimeoutService()

const enableRequestTimeouts = ref<boolean>(true)

const getPlayingStatusGridCols = (game: Game) => {
  if (isSameCoachForBothTeams(game)) {
    return 2
  }

  return enableRequestTimeouts.value ? 2 : 1
}

const ACTIONS_GRID_COLS: Record<string, number> = {
  default: 1,
  warmup: 2,
  resting: 1,
  playing: enableRequestTimeouts.value ? 2 : 1, // grid-cols-2 if timeouts are enabled
  finished: 2,
  undefined: 1,
}

const showGameRequestDateIds = ref<number[]>([])
const timeoutRequestedByOpponent = ref<boolean>(false)

const gameSignatures = ref<GameSignature[]>(
  props.games.flatMap(game => game.signatures ?? []),
)
const setToRequestTimeout = ref<number>()
const loadingTimeout = ref<boolean>(false)

const gamesWithSanctionedMembersToChange = computed((): Game[] =>
  props.games.filter((game, index) => {
    const teamRotation = game.currentSet?.rotations?.find(
      rotation => rotation.callId === props.calls[index].id,
    )
    const inCourtProfileIds = teamRotation?.players?.map(
      player => player.inCourtProfileId,
    )

    return game.currentSet?.sanctions?.some(
      sanction =>
        sanction.type === SanctionType.member &&
        EXPULSION_SEVERITIES.includes(sanction.severity) &&
        sanction.teamId === props.calls[index].teamId &&
        sanction.playerProfileId &&
        inCourtProfileIds?.includes(sanction.playerProfileId),
    )
  }),
)

const showCoachButtonChangeDate = (game: Game) => {
  // return (
  //   auth.user &&
  //   (game.localTeam?.coachId === auth.user.id || game.requestedDate)
  // )
  return game.date && !isMatchDayPassed(game)
}

const requestTimeout = async () => {
  const call = !!timeoutRequestedByOpponent.value
    ? props.opponentCalls[0]
    : props.calls[0]

  const storeTimeoutForm: TimeoutStoreRequest = {
    setId: setToRequestTimeout.value ?? 0,
    teamId: call.teamId ?? 0,
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

const currentSetRotation = (game: Game, callId: number): Rotation | undefined =>
  game.currentSet?.rotations?.find(rotation => rotation.callId === callId)

const callUnlocked = (
  callIndex: number,
  opponent: boolean = false,
): boolean | undefined => {
  const call = opponent
    ? props.opponentCalls[callIndex]
    : props.calls[callIndex]

  return !call?.locked || call?.playersData.length < MIN_CALL_PLAYERS
}

const rotationLocked = (
  callIndex: number,
  opponent: boolean = false,
): boolean => {
  const call = opponent
    ? props.opponentCalls[callIndex]
    : props.calls[callIndex]

  return !!call.currentRotation?.locked
}

const maxSetPlayerChangesReached = (
  game: Game,
  callId: number,
): boolean | undefined => {
  const rotation = currentSetRotation(game, callId)

  if (!rotation) return

  return rotation.playerChangesCount >= MAX_ROTATION_PLAYER_CHANGES
}

const getGameObservationsCountdownTarget = (game: Game): number =>
  moment(game.end).add(GAME_OBSERVATIONS_DELAY, 'minutes').valueOf()

const onCountdownEnded = ({ game, call }: { game: Game; call: Call }) =>
  emit('countdown:ended', { game, call })

const redirectIfSanctionedMembersToChange = () => {
  if (gamesWithSanctionedMembersToChange.value.length) {
    const game = gamesWithSanctionedMembersToChange.value[0]
    const call = props.calls.find(call => call.gameId === game.id)
    const rotation = currentSetRotation(game, call?.id ?? 0)
    if (game && call && rotation) {
      navigateTo(
        `/coach/games/${game.id}/teams/${call.teamId}/rotations/${rotation.id}/player-change`,
      )
    }
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

const showReportSignedMessage = (game: Game, index: number): boolean => {
  const callSigned = reportAlreadySignedByCoachAndCaptain(
    game,
    props.calls[index],
  )

  if (isSameCoachForBothTeams(game)) {
    const opponentCallSigned = reportAlreadySignedByCoachAndCaptain(
      game,
      props.opponentCalls[index],
    )
    return callSigned && opponentCallSigned
  }

  return callSigned
}

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
  // navigateTo(`/coach/games/${game.id}/edit`)

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

const handleTimeoutRequested = (setId?: number, opponent: boolean = false) => {
  timeoutRequestedByOpponent.value = opponent
  setToRequestTimeout.value = setId
}

onMounted(redirectIfSanctionedMembersToChange)
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

      <EasyGrid
        class="actions mt-3"
        :gap="2"
        :cols="
          game.status === 'playing'
            ? getPlayingStatusGridCols(game)
            : ACTIONS_GRID_COLS[game.status ?? 'default']
        "
      >
        <template v-if="game.status">
          <template v-if="game.status === 'warmup'">
            <CoachButtonCall
              class="action"
              :gameId="game.id"
              :teamId="calls[index]?.teamId"
              :locked="!!calls[index]?.locked"
            />
            <CoachButtonCall
              v-if="isSameCoachForBothTeams(game)"
              class="action"
              :gameId="game.id"
              :teamId="opponentCalls[index]?.teamId"
              :locked="!!opponentCalls[index]?.locked"
            />
          </template>
          <template v-if="['warmup', 'resting'].includes(game.status)">
            <CoachButtonRotation
              class="action"
              :gameId="game.id"
              :callId="calls[index]?.id"
              :callUnlocked="!!callUnlocked(index)"
              :locked="!!currentSetRotation(game, calls[index]?.id)?.locked" />
            <CoachButtonRotation
              v-if="isSameCoachForBothTeams(game)"
              class="action"
              :gameId="game.id"
              :callId="opponentCalls[index]?.id"
              :callUnlocked="!!callUnlocked(index, true)"
              :locked="
                !!currentSetRotation(game, opponentCalls[index]?.id)?.locked
              "
          /></template>
          <template v-if="game.status === 'playing'">
            <CoachButtonPlayerChange
              class="action"
              :gameId="game.id"
              :teamId="calls[index]?.teamId"
              :rotation="currentSetRotation(game, calls[index]?.id)"
              :locked="
                !!rotationLocked(index) ||
                !!maxSetPlayerChangesReached(game, calls[index]?.id)
              "
            />
            <CoachButtonPlayerChange
              v-if="isSameCoachForBothTeams(game)"
              class="action"
              :gameId="game.id"
              :teamId="opponentCalls[index]?.teamId"
              :rotation="currentSetRotation(game, opponentCalls[index]?.id)"
              :locked="
                !!rotationLocked(index, true) ||
                !!maxSetPlayerChangesReached(game, opponentCalls[index]?.id)
              "
            />
            <template v-if="enableRequestTimeouts">
              <CoachButtonTimeout
                class="action"
                :game="game"
                :teamId="calls[index].teamId"
                :loading="loadingTimeout"
                @timeout:dialog="handleTimeoutRequested($event)"
              />
              <CoachButtonTimeout
                v-if="isSameCoachForBothTeams(game)"
                class="action"
                :game="game"
                :teamId="opponentCalls[index].teamId"
                :loading="loadingTimeout"
                @timeout:dialog="handleTimeoutRequested($event, true)"
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
              {{ t('reports.closed') }}
            </div>
            <template v-else>
              <template
                v-for="gameSignatureType in [
                  GameSignatureTypes.coach,
                  GameSignatureTypes.captain,
                ]"
              >
                <CoachButtonSign
                  v-if="!!calls[index]"
                  class="action"
                  :game="game"
                  :call="calls[index]"
                  :signature-type="gameSignatureType"
                  :disabled="
                    signButtonTypeDisabled(
                      game,
                      calls[index],
                      gameSignatureType,
                    )
                  "
                  @signature:stored="handleSignatureStored"
                />
                <CoachButtonSign
                  v-if="isSameCoachForBothTeams(game) && !!opponentCalls[index]"
                  class="action"
                  :game="game"
                  :call="opponentCalls[index]"
                  :signature-type="gameSignatureType"
                  :disabled="
                    signButtonTypeDisabled(
                      game,
                      opponentCalls[index],
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
        :class="[
          `col-span-${ACTIONS_GRID_COLS[game.status ?? 'default']} mt-3`,
        ]"
        v-slot="{ minutes, seconds }"
        :target="getGameObservationsCountdownTarget(game)"
        @countdown:ended="onCountdownEnded({ game, call: calls[index] })"
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

      <template #footer>
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
