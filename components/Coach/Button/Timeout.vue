<script setup lang="ts">
import { Game } from '@/domain/game'
import {
  Timeout,
  TimeoutStatusEnum,
  MAX_TIMEOUTS_PER_SET,
  TimeoutStatus,
} from '@/domain/timeout'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    required: true,
  },
  teamId: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'timeout:dialog', value: number | undefined): void
}>()

const { t } = useI18n()
const toast = useEasyToast()

const timeouts = computed((): Timeout[] | undefined =>
  props.game.currentSet?.timeouts?.length
    ? props.game.currentSet?.timeouts
    : undefined,
)

const teamTimeouts = computed((): Timeout[] | undefined =>
  props.game.currentSet?.timeouts?.filter(
    timeout => timeout.teamId === props.teamId,
  ),
)

const gameTimeoutsByStatus = (
  status: TimeoutStatus,
  currentTeam?: boolean,
): Timeout | undefined => {
  const ts = currentTeam ? teamTimeouts.value : timeouts.value
  if (!ts?.length) return
  return ts?.find(timeout => timeout.status === status)
}

const checkIfCanRequestTimeout = (currentTeam?: boolean) => {
  if (props.game.status !== 'playing') {
    toast.error(t('errors.timeout_game_not_playing'))
    return
  }

  const requestedTimeout = gameTimeoutsByStatus(
    TimeoutStatusEnum.requested,
    currentTeam,
  )
  if (!!requestedTimeout) {
    toast.warn(t('errors.timeout_requested'))
    return
  }

  const runningTimeout = gameTimeoutsByStatus(
    TimeoutStatusEnum.running,
    currentTeam,
  )
  if (!!runningTimeout) {
    toast.warn(t('errors.timeout_running'))
    return
  }

  if (teamTimeouts.value?.length === MAX_TIMEOUTS_PER_SET) {
    toast.error(
      t('errors.max_timeouts', {
        max: MAX_TIMEOUTS_PER_SET,
      }),
    )
    return
  }

  emit('timeout:dialog', props.game.currentSet?.id)
}
</script>

<template>
  <Button
    class="action"
    :severity="
      gameTimeoutsByStatus(TimeoutStatusEnum.requested) ||
      gameTimeoutsByStatus(TimeoutStatusEnum.running)
        ? 'warning'
        : teamTimeouts && teamTimeouts?.length >= MAX_TIMEOUTS_PER_SET
        ? 'danger'
        : 'primary'
    "
    outlined
    :label="t('timeouts.timeout')"
    :disabled="props.loading || !props.game.currentSet?.id"
    @click.prevent="checkIfCanRequestTimeout()"
  />
</template>

<script lang="ts">
export default {
  name: 'CoachButtonTimeout',
}
</script>
