<script setup lang="ts">
import { DialogProps } from 'primevue/dialog'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  header: {
    type: String,
    default: null,
  },
  footer: {
    type: Object as PropType<any>,
    default: null,
  },
  append: {
    type: String,
    default: '.easy-alerts',
  },
  class: {
    type: String,
    default: '',
  },
  draggable: {
    type: Boolean,
    default: false,
  },
  dismissableMask: {
    type: Boolean,
    default: true,
  },
  position: {
    type: String as PropType<DialogProps['position']>,
    default: 'bottom',
  },
  breakpoints: {
    type: Object as PropType<DialogProps['breakpoints']>,
    default: () => ({
      '0px': '400px',
    }),
  },
})

const emit = defineEmits(['hide'])

const showDialog = ref<boolean>(props.visible)

const classes = computed(
  () => `easy-dialog-${props.position}-component ${props.class}`,
)

watch(
  () => props.visible,
  value => (showDialog.value = value),
)
</script>

<template>
  <Dialog
    :class="classes"
    v-model:visible="showDialog"
    :append-to="append"
    :draggable="draggable"
    :dismissableMask="dismissableMask"
    :position="position"
    :breakpoints="breakpoints"
    modal
    @hide="emit('hide', true)"
  >
    <template #header><slot name="header" /></template>
    <slot />
    <template #footer><slot name="footer" /></template>
  </Dialog>
</template>

<script lang="ts">
export default {
  name: 'DialogBottom',
}
</script>
