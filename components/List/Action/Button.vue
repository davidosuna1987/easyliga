<script setup lang="ts">
import { IconName, IconNames } from '@/domain/icon'
import { ButtonProps } from 'primevue/button'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String as PropType<IconName>,
    required: false,
  },
  iconSize: {
    type: String,
    default: '1.5rem',
  },
  size: {
    type: String as PropType<ButtonProps['size']>,
    default: 'small',
  },
  severity: {
    type: String as PropType<ButtonProps['severity']>,
    default: 'primary',
  },
  outlined: {
    type: Boolean,
    required: false,
  },
  onClick: {
    type: Function,
    required: false,
  },
})

const handleOnClick = () => {
  if (!props.onClick) return
  props.onClick()
}
</script>

<template>
  <Button
    :class="['easy-list-action-button-component', { 'is-icon': !!icon }]"
    :severity="severity"
    :label="icon ? undefined : label"
    :size="size"
    :outlined="outlined"
    v-tooltip.top="{
      value: label,
      disabled: !icon,
    }"
    @click.prevent="handleOnClick"
  >
    <template v-if="icon">
      <Icon :name="IconNames[icon]" :size="iconSize" />
    </template>
    <template v-else>{{ label }}</template>
  </Button>
</template>

<style scoped lang="scss">
.easy-list-action-button-component {
  padding-block: 0.25rem;

  &.is-icon {
    padding: 0.375rem;
    display: grid;
    place-content: center;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
  }
}
</style>

<script lang="ts">
export default {
  name: 'ListActionButton',
}
</script>
