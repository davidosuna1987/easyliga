<script setup lang="ts">
import { ListColor } from '@/domain/list'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  color: {
    type: String as PropType<ListColor>,
    default: 'primary',
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'small',
  },
})
</script>

<template>
  <Tag
    :class="[
      'font-light border-solid bg-transparent border py-[2px] px-2',
      {
        'borer-[var(--highlight-color)] text-[var(--highlight-color)]':
          color === 'primary',
        'border-[var(--blue-color)] text-[var(--blue-color)]': color === 'blue',
        'border-[var(--pink-color)] text-[var(--pink-color)]': color === 'pink',
        'border-[var(--yellow-color)] text-[var(--yellow-color)]':
          color === 'yellow',
        'text-lg py-[5px] px-5': size === 'large',
        'text-[1rem] py-[3.5px] px-3.5': size === 'medium',
        'py-[2px] px-2': size === 'small',
      },
    ]"
    :value="label"
    rounded
  />
</template>

<script lang="ts">
export default {
  name: 'ListTag',
}
</script>
