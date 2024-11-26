<script setup lang="ts">
import { ButtonProps } from 'primevue/button'
import { IconName, IconNames } from '@/domain/icon'

const props = defineProps({
  name: {
    type: String as PropType<IconName>,
    required: true,
  },
  size: {
    type: String,
    required: false,
  },
  button: {
    type: String as PropType<ButtonProps['severity']>,
    required: false,
  },
  rounded: {
    type: Boolean,
    default: true,
  },
  tooltip: {
    type: String,
    required: false,
  },
  tooltipPosition: {
    type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
    default: 'top',
  },
})

const buttonSize = computed(() => {
  if (props.size) {
    const sizeValue = parseFloat(props.size)
    const sizeUnit = props.size.replace(String(sizeValue), '')

    if (!sizeUnit) {
      return `${sizeValue * 2}rem`
    }

    return `${sizeValue * 2}${sizeUnit}`
  }

  return '2rem'
})
</script>

<template>
  <div
    v-if="!!button"
    :class="[
      'easy-icon-component grid place-content-center cursor-pointer',
      `bg-${button} w-[${buttonSize}] h-[${buttonSize}]`,
      { 'rounded-full': props.rounded },
    ]"
    v-tooltip="{
      value: tooltip,
      position: tooltipPosition,
    }"
  >
    <Icon :name="IconNames[name]" :size="size" />
  </div>
  <Icon
    v-else
    class="easy-icon-component"
    :name="IconNames[name]"
    :size="size"
  />
</template>

<script lang="ts">
export default {
  name: 'EasyIcon',
}
</script>
