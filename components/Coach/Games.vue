<script setup lang="ts">
import { Game, GAME_OBSERVATIONS_DELAY, isMatchDayPassed } from '@/domain/game'
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
import TimeoutService from '@/services/timeout'
import { EXPULSION_SEVERITIES, SanctionType } from '@/domain/sanction'
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

const ACTIONS_GRID_COLS: Record<string, number> = {
  default: 1,
  warmup: 2,
  resting: 1,
  playing: 1, // grid-cols-2 if timeouts are enabled
  finished: 2,
  undefined: 1,
}

const showGameRequestDateIds = ref<number[]>([])

const gameSignatures = ref<GameSignature[]>(
  props.games.flatMap(game => game.signatures ?? []),
)
const setToRequestTimeout = ref<number>()
const loadingTimeout = ref<boolean>(false)
const enableRequestTimeouts = ref<boolean>(false)

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
  const storeTimeoutForm: TimeoutStoreRequest = {
    setId: setToRequestTimeout.value ?? 0,
    teamId: props.calls[0].teamId ?? 0,
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

const callUnlocked = (callIndex: number): boolean | undefined =>
  !props.calls[callIndex]?.locked ||
  props.calls[callIndex]?.playersData.length < MIN_CALL_PLAYERS

const rotationLocked = (callIndex: number): boolean | undefined =>
  props.calls[callIndex]?.currentRotation?.locked

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
        :cols="ACTIONS_GRID_COLS[game.status ?? 'default']"
      >
        <template v-if="game.status">
          <CoachButtonCall
            v-if="game.status === 'warmup'"
            class="action"
            :gameId="game.id"
            :teamId="calls[index]?.teamId"
            :locked="!!calls[index]?.locked"
          />
          <CoachButtonRotation
            v-if="['warmup', 'resting'].includes(game.status)"
            class="action"
            :gameId="game.id"
            :callId="calls[index]?.id"
            :callUnlocked="!!callUnlocked(index)"
            :locked="!!currentSetRotation(game, calls[index]?.id)?.locked"
          />
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
            <CoachButtonTimeout
              v-if="enableRequestTimeouts"
              class="action"
              :game="game"
              :teamId="calls[index].teamId"
              :loading="loadingTimeout"
              @timeout:dialog="setToRequestTimeout = $event"
            />
          </template>
          <template v-if="game.status === 'finished'">
            <div
              v-if="reportAlreadySignedByCoachAndCaptain(game, calls[index])"
              class="col-span-3 text-xs text-[var(--danger-color)] flex items-center justify-center"
            >
              {{ t('reports.closed') }}
            </div>
            <template v-else>
              <CoachButtonSign
                v-if="!!calls[index]"
                v-for="gameSignatureType in [
                  GameSignatureTypes.coach,
                  GameSignatureTypes.captain,
                ]"
                class="action"
                :game="game"
                :call="calls[index]"
                :signature-type="gameSignatureType"
                :disabled="
                  signButtonTypeDisabled(game, calls[index], gameSignatureType)
                "
                @signature:stored="handleSignatureStored"
              />
              <EasyCountdown
                class="col-span-3"
                v-slot="{ minutes, seconds }"
                :target="getGameObservationsCountdownTarget(game)"
                @countdown:ended="
                  onCountdownEnded({ game, call: calls[index] })
                "
              >
                <div
                  class="text-xs text-[var(--danger-color)] flex items-center justify-center"
                >
                  {{ t('reports.countdown') }}
                  <pre class="text-xs ml-2">{{ minutes }}:{{ seconds }}</pre>
                </div>
              </EasyCountdown>
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
