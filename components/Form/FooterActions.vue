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
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hideSubmit: {
    type: Boolean,
    default: false,
  },
  hideCancel: {
    type: Boolean,
    default: false,
  },
  submitClass: {
    type: Array as PropType<string[]>,
    required: false,
  },
  size: {
    type: String as PropType<ButtonProps['size']>,
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
      v-if="!hideCancel"
      class="grayscale"
      :label="cancelLabelText"
      severity="info"
      :size="size"
      :disabled="disabled"
      :loading="loading"
      outlined
      @click="emit('form:cancel', true)"
    />
    <Button
      v-if="!hideSubmit"
      :class="submitClass?.join(' ')"
      :label="submitLabelText"
      :severity="submitSeverity"
      :size="size"
      :disabled="disabled"
      :loading="loading"
      @click="emit('form:submit', true)"
    />
  </footer>
</template>

<script lang="ts">
export default {
  name: 'FormFooterActions',
}
</script>
