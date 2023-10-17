<script setup lang="ts">
import { Game, GAME_OBSERVATIONS_DELAY } from '@/domain/game'
import { Call, MIN_CALL_PLAYERS } from '@/domain/call'
import { Rotation, MAX_ROTATION_PLAYER_CHANGES } from '@/domain/rotation'
import { TimeoutStatusEnum, mapApiTimeoutToTimeout } from '@/domain/timeout'
import TimeoutService from '@/services/timeout'
import moment from 'moment'

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

const emit = defineEmits(['timeout:requested', 'countdown:ended'])

const setToRequestTimeout = ref<number>()
const loadingTimeout = ref<boolean>(false)

const requestTimeout = async () => {
  const storeTimeoutForm = {
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
    console.log({ data: data.value })
    toast.success(app.$i18n.t('timeouts.requested'))
    emit('timeout:requested', mapApiTimeoutToTimeout(data.value.data.timeout))
  }
}

const currentSetRotation = (
  game: Game,
  callId: number,
): Rotation | undefined => {
  return game.currentSet?.rotations?.find(
    rotation => rotation.callId === callId,
  )
}

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

const onCountdownEnded = (game: Game) => emit('countdown:ended', game)
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
          <CoachButtonInjuries
            class="action"
            :game="game"
            :call="calls[index]"
          />
          <CoachButtonObservations class="action" :call="calls[index]" />
          <Button class="action" :label="$t('games.close_acta')" outlined />

          <Countdown
            v-if="getGameObservationsCountdownTarget(game) >= Date.now()"
            class="col-span-3"
            :target="getGameObservationsCountdownTarget(game)"
            v-slot="{ minutes, seconds }"
            @countdown:ended="onCountdownEnded(game)"
          >
            <div
              class="text-xs text-[var(--danger-color)] flex items-center justify-center"
            >
              {{ $t('observations.countdown') }}
              <pre class="text-xs ml-2">{{ minutes }}:{{ seconds }}</pre>
            </div>
          </Countdown>
        </template>
      </div>
    </div>

    <DialogBottom
      class="easy-coach-rotation-players-dialog-component"
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
