<script setup lang="ts">
import { Game, GAME_OBSERVATIONS_DELAY } from '@/domain/game'
import { Call, MIN_CALL_PLAYERS } from '@/domain/call'
import { Rotation, MAX_ROTATION_PLAYER_CHANGES } from '@/domain/rotation'
import {
  TimeoutStatusEnum,
  TimeoutStoreRequest,
  mapApiTimeoutToTimeout,
} from '@/domain/timeout'
import TimeoutService from '@/services/timeout'
import moment from 'moment'
import { EXPULSION_SEVERITIES, SanctionType } from '@/domain/sanction'

const app = useNuxtApp()
const toast = useEasyToast()
const timeoutService = new TimeoutService()

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

const emit = defineEmits([
  'timeout:requested',
  'countdown:ended',
  'report:signed',
])

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
    toast.success(app.$i18n.t('timeouts.requested'))
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

onMounted(redirectIfSanctionedMembersToChange)

onBeforeUnmount(() => {
  window.Echo.leaveAllChannels()
})
</script>

<template>
  <div class="easy-coach-current-games-component">
    <div v-for="(game, index) in games" class="game">
      <header class="name text-center">{{ game.name }}</header>
      <GameStatus :status="game.status" />
      <div
        class="actions grid gap-2 mt-3"
        :class="[
          game.status === 'finished'
            ? 'grid-cols-3'
            : game.status === 'warmup'
            ? 'grid-cols-2'
            : game.status === 'resting'
            ? 'grid-cols-1'
            : 'grid-cols-2',
        ]"
      >
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
            class="action"
            :game="game"
            :teamId="calls[index].teamId"
            :loading="loadingTimeout"
            @timeout:dialog="setToRequestTimeout = $event"
          />
        </template>
        <template v-if="game.status === 'finished'">
          <div
            v-if="calls[index].signedAt"
            class="col-span-3 text-xs text-[var(--danger-color)] flex items-center justify-center"
          >
            {{ $t('reports.closed') }}
          </div>
          <template v-else>
            <CoachButtonInjuries
              class="action"
              :game="game"
              :call="calls[index]"
            />
            <CoachButtonObservations class="action" :call="calls[index]" />
            <CoachButtonSign
              class="action"
              :game="game"
              :call="calls[index]"
              @report:signed="emit('report:signed', $event)"
            />
            <Countdown
              v-if="getGameObservationsCountdownTarget(game) >= Date.now()"
              class="col-span-3"
              :target="getGameObservationsCountdownTarget(game)"
              v-slot="{ minutes, seconds }"
              @countdown:ended="onCountdownEnded({ game, call: calls[index] })"
            >
              <div
                class="text-xs text-[var(--danger-color)] flex items-center justify-center"
              >
                {{ $t('observations.countdown') }}
                <pre class="text-xs ml-2">{{ minutes }}:{{ seconds }}</pre>
              </div>
            </Countdown>
          </template>
        </template>
      </div>
    </div>

    <DialogBottom
      class="easy-coach-timeout-request-dialog-component"
      :visible="!!setToRequestTimeout"
      @hide="setToRequestTimeout = undefined"
    >
      <template #header>
        <Heading tag="h6">{{ $t('timeouts.request') }}</Heading>
      </template>

      <p>{{ $t('timeouts.request_alert') }}</p>
      <!-- <p v-if="currentSetGame" class="mt-2">
        {{
          $t(
            'timeouts.request_disclaimer',
            {
              num:
                MAX_TIMEOUTS_PER_SET -
                (gameTimeouts(currentSetGame)?.length ?? 0),
            },
            MAX_TIMEOUTS_PER_SET - (gameTimeouts(currentSetGame)?.length ?? 0),
          )
        }}
      </p> -->

      <template #footer>
        <div class="flex justify-end gap-3 mt-3">
          <Button
            class="grayscale"
            :label="$t('forms.cancel')"
            severity="info"
            outlined
            @click="setToRequestTimeout = undefined"
          />
          <Button :label="$t('forms.request')" @click="requestTimeout" />
        </div>
      </template>
    </DialogBottom>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CoachCurrentGames',
}
</script>
