<script setup lang="ts">
import { GridBreakpoints, mapBreakpointsToClasses } from '@/domain/grid'

const props = defineProps({
  cols: {
    type: Number,
    default: 1,
  },
  gap: {
    type: Number,
    default: 3,
  },
  breakpoints: {
    type: Object as PropType<GridBreakpoints>,
    required: false,
  },
})
</script>

<template>
  <div
    :class="[
      'easy-grid-component',
      `grid grid-cols-${breakpoints?.xs ?? cols} gap-${gap}`,
      breakpoints && mapBreakpointsToClasses(breakpoints),
    ]"
  >
    <slot />
  </div>
</template>

<script lang="ts">
export default {
  name: 'EasyGrid',
}
</script>
