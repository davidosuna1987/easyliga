<script setup lang="ts">
import { ButtonProps } from 'primevue/button'

const props = defineProps({
  submitLabel: {
    type: String,
    default: () => useNuxtApp().$i18n.t('forms.store'),
  },
  cancelLabel: {
    type: String,
    default: () => useNuxtApp().$i18n.t('forms.cancel'),
  },
  submitSeverity: {
    type: String as PropType<ButtonProps['severity']>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'form:submit', value: boolean): void
  (e: 'form:cancel', value: boolean): void
}>()
</script>

<template>
  <footer
    class="easy-form-footer-actions-component flex justify-end gap-3 mt-3"
  >
    <Button
      class="grayscale"
      :label="cancelLabel"
      severity="info"
      outlined
      @click="emit('form:cancel', true)"
    />
    <Button
      :label="submitLabel"
      :severity="submitSeverity"
      @click="emit('form:submit', true)"
    />
  </footer>
</template>

<script lang="ts">
export default {
  name: 'FormFooterActions',
}
</script>
