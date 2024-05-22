<script setup lang="ts">
import { ShirtColor } from '@/domain/team'

const props = defineProps({
  color: {
    type: String as PropType<ShirtColor>,
    required: false,
  },
})
</script>

<template>
  <div class="flex items-center">
    <span
      :class="[
        `rounded-sm mr-2 w-12 h-3 inline-block shirt-item-${props.color}`,
      ]"
    >
    </span>
    <span>{{ $t(`shirt_colors.${props.color}`) }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TeamShirtColorItem',
}
</script>
