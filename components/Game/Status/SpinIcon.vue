<script setup lang="ts">
import { GameStatus } from '@/domain/game'
import { RotationPlayerStatus } from '@/domain/rotation'

const props = defineProps({
  status: {
    type: String as PropType<GameStatus | RotationPlayerStatus | string>,
    required: false,
  },
  size: {
    type: String,
    default: '1rem',
  },
})

const { t } = useI18n()
</script>

<template>
  <div
    :class="[status, 'easy-game-status-spin-icon-component']"
    :style="{ width: size, height: size }"
  >
    <svg
      :aria-label="`${
        status ? 'status ' + status : t('forms.loading').replace('...', '')
      }`"
      width="100%"
      height="100%"
      fill="none"
      viewBox="0 0 16 16"
      class="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        class="stroke"
        stroke-width="2"
        d="M3.05 3.05a7 7 0 1 1 9.9 9.9 7 7 0 0 1-9.9-9.9Z"
        opacity=".5"
      ></path>
      <path
        class="fill"
        fill-rule="evenodd"
        d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
        clip-rule="evenodd"
      ></path>
      <path class="fill" d="M14 8a6 6 0 0 0-6-6V0a8 8 0 0 1 8 8h-2Z"></path>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.easy-game-status-spin-icon-component {
  &.warmup,
  &.timeout,
  &.resting,
  &.pending {
    .stroke {
      stroke: var(--tertiary-color-dark);
    }

    .fill {
      fill: var(--tertiary-color-dark);
    }
  }

  &.playing,
  &.approved {
    .stroke {
      stroke: var(--primary-color);
    }

    .fill {
      fill: var(--primary-color);
    }
  }

  &.denied {
    .stroke {
      stroke: var(--danger-color);
    }

    .fill {
      fill: var(--danger-color);
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'GameStatusSpinIcon',
}
</script>
