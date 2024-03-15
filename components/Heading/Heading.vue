<script setup lang="ts">
import { HeadingPosition } from '@/types/heading'

const props = defineProps({
  tag: {
    type: String,
    default: 'h4',
  },
  position: {
    type: String as PropType<HeadingPosition>,
    default: 'left',
  },
  class: {
    type: String,
    default: '',
  },
})

const headingPositionClass = computed(() =>
  props.position ? `text-${props.position}` : '',
)
</script>

<template>
  <Component :is="tag" :class="[props.class, headingPositionClass]">
    <slot />
  </Component>
</template>

<script lang="ts">
export default {
  name: 'Heading',
}
</script>
