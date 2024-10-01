<script setup lang="ts">
import { IconNames } from '@/domain/icon'
import { GameStatus } from '@/domain/game'
import { formatTime } from '@/domain/utils'
import { RotationPlayerStatus } from '@/domain/rotation'

const props = defineProps({
  status: {
    type: String as PropType<GameStatus | RotationPlayerStatus>,
    required: false,
  },
  statusLabel: {
    type: String,
    required: false,
  },
  start: {
    type: String,
    required: false,
  },
  reduced: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
</script>

<template>
  <div
    class="easy-game-status-component inline-flex items-center"
    :class="props.status"
  >
    <template v-if="status">
      <Icon
        v-if="status === 'finished'"
        :name="IconNames.gameFinished"
        size="1.15rem"
      />
      <Icon
        v-else-if="status === 'denied'"
        :name="IconNames.times"
        size="1.15rem"
      />
      <GameStatusSpinIcon v-else :status="status" />
      <span v-if="!reduced" class="label" :class="props.status">
        {{ statusLabel ?? t(`games.status.${status}`) }}
      </span>
    </template>
    <span v-else-if="start" class="label">
      {{ t(`games.status.start`, { start: formatTime(start) }) }}
    </span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameStatus',
}
</script>
