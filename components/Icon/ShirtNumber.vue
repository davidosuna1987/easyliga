<script setup lang="ts">
import { ShirtColor } from '@/domain/team'

const props = defineProps({
  shirtNumber: {
    type: [Number, String],
    required: false,
  },
  size: {
    type: String,
    required: false,
  },
  color: {
    type: String as PropType<ShirtColor>,
    required: false,
  },
  isIcon: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: true,
  },
})

const sizeClass = computed(() => {
  return props.size ? `size-${props.size}` : ''
})

const colorClass = computed(() => {
  return props.color ? `color-${props.color}` : ''
})
</script>

<template>
  <div
    v-if="shirtNumber !== undefined"
    class="easy-icon-shirt-number-component"
    :class="[
      sizeClass,
      colorClass,
      { 'is-icon': !!isIcon, 'is-rounded': rounded },
    ]"
  >
    <span class="relative z-10">{{ shirtNumber }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'IconShirtNumber',
}
</script>
