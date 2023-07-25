<script setup lang="ts">
import { ApiError } from 'domain/errors'

const props = defineProps({
  errors: {
    type: Array<ApiError>,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
})

const showDialog = ref<boolean>(props.visible)

watch(
  () => props.visible,
  value => (showDialog.value = value),
)
</script>

<template>
  <Dialog
    class="easy-error-dialog"
    :draggable="false"
    :dismissableMask="true"
    v-model:visible="showDialog"
    append-to=".easy-alerts"
    modal
    position="bottom"
    :breakpoints="{
      '0px': '400px',
    }"
    @hide="$emit('hide', true)"
  >
    <template #header>&nbsp;</template>
    <ErrorList :errors="errors" />
    <template #footer></template>
  </Dialog>
</template>
