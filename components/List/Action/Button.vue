<script setup lang="ts">
import { ButtonProps } from 'primevue/button'

const props = defineProps({
  label: {
    type: String,
    required: true,
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
    class="easy-list-action-button-component"
    :severity="severity"
    :label="label"
    :size="size"
    :outlined="outlined"
    @click.prevent="handleOnClick"
  />
</template>

<style scoped>
.easy-list-action-button-component {
  padding-block: 0.25rem;
}
</style>

<script lang="ts">
export default {
  name: 'ListActionButton',
}
</script>
