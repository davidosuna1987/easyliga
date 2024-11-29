<script setup lang="ts">
import { ButtonProps } from 'primevue/button'

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
    required: false,
  },
  acceptLabel: {
    type: String,
    required: false,
  },
  cancelLabel: {
    type: String,
    required: false,
  },
  severity: {
    type: String as PropType<ButtonProps['severity']>,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hideCancel: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'accepted', value: boolean): void
  (e: 'hide', value: boolean): void
}>()

const { t } = useI18n()

const showDialog = ref<boolean>(!!props.visible)

const acceptLabelText = computed(() => props.acceptLabel ?? t('forms.accept'))
const cancelLabelText = computed(() => props.cancelLabel ?? t('forms.cancel'))

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
    <p v-if="message" class="mt-3 text-[1.15rem]">{{ message }}</p>

    <slot />

    <template #stickyFooter>
      <FormFooterActions
        :submitSeverity="severity"
        :submitLabel="acceptLabelText"
        :cancelLabel="cancelLabelText"
        :hideCancel="hideCancel"
        :disabled="props.disabled"
        :loading="props.loading"
        @form:submit="emit('accepted', true)"
        @form:cancel="emit('hide', true)"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'AlertDialog',
}
</script>
