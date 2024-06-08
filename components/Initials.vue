<script setup lang="ts">
import { AVATAR_STYLES } from '@/domain/profile'

const props = defineProps({
  initials: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 100,
  },
  background: {
    type: String,
    default: AVATAR_STYLES.background,
  },
  color: {
    type: String,
    default: AVATAR_STYLES.color,
  },
})

const sizeDivider = computed((): number => props.initials.length)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    :style="{ backgroundColor: background }"
  >
    <text
      :x="size / 2"
      :y="size / 1.8"
      :font-size="size / sizeDivider"
      :fill="color"
      text-anchor="middle"
      dominant-baseline="middle"
      font-family="system-ui"
      font-weight="600"
    >
      {{ initials }}
    </text>
  </svg>
</template>

<style scoped>
svg {
  display: block;
  margin: auto;
}
</style>

<script lang="ts">
export default {
  name: 'Initials',
}
</script>
