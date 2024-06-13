<script setup lang="ts">
import { ButtonProps } from 'primevue/button'

const props = defineProps({
  submitLabel: {
    type: String,
    required: false,
  },
  cancelLabel: {
    type: String,
    required: false,
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

const { t } = useI18n()

const submitLabelText = computed(() => props.submitLabel ?? t('forms.store'))
const cancelLabelText = computed(() => props.cancelLabel ?? t('forms.cancel'))
</script>

<template>
  <footer
    class="easy-form-footer-actions-component flex justify-end gap-3 mt-3"
  >
    <Button
      class="grayscale"
      :label="cancelLabelText"
      severity="info"
      outlined
      @click="emit('form:cancel', true)"
    />
    <Button
      :label="submitLabelText"
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
