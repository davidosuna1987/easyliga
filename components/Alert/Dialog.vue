<script setup lang="ts">
import { ButtonProps } from 'primevue/button'
const emit = defineEmits(['accepted', 'hide'])

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
  acceptLabel: {
    type: String,
    default: () => useNuxtApp().$i18n.t('forms.accept'),
  },
  cancelLabel: {
    type: String,
    default: () => useNuxtApp().$i18n.t('forms.cancel'),
  },
  severity: {
    type: String as PropType<ButtonProps['severity']>,
    default: null,
  },
})

const showDialog = ref<boolean>(!!props.visible)

watch(
  () => props.visible,
  value => (showDialog.value = value),
)
</script>

<template>
  <DialogBottom
    class="easy-alert-dialog-component"
    :visible="showDialog"
    @hide="emit('hide', true)"
  >
    <template #header>
      <Heading v-if="title" tag="h5">{{ title }}</Heading>
    </template>
    <Heading tag="h6">{{ message }}</Heading>

    <template #footer>
      <div class="flex justify-end gap-3 mt-3">
        <Button
          class="grayscale"
          :label="cancelLabel"
          severity="info"
          outlined
          @click="emit('hide', true)"
        />
        <Button
          :label="acceptLabel"
          :severity="severity"
          @click="emit('accepted', true)"
        />
      </div>
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'AlertDialog',
}
</script>
