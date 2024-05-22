<script setup lang="ts">
import { ShirtColor } from '@/domain/team'

const props = defineProps({
  color: {
    type: String as PropType<ShirtColor>,
    required: false,
  },
  bullet: {
    type: Number,
    default: 0,
  },
})

const bulletClass = computed(() =>
  props.bullet ? `rounded-full` : 'rounded-sm w-12 h-3 mr-2',
)

const style = computed(() => {
  if (props.bullet) {
    return {
      width: `${props.bullet}px`,
      height: `${props.bullet}px`,
    }
  }
})
</script>

<template>
  <div class="flex items-center">
    <span
      :class="[`inline-block shirt-item-${props.color}`, bulletClass]"
      :style="style"
    >
    </span>
    <span v-if="!bullet">{{ $t(`shirt_colors.${props.color}`) }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TeamShirtColorItem',
}
</script>
