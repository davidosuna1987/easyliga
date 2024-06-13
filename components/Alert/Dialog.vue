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
    required: true,
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
    <Heading tag="h6">{{ message }}</Heading>

    <template #footer>
      <div class="flex justify-end gap-3 mt-3">
        <Button
          class="grayscale"
          :label="cancelLabelText"
          severity="info"
          outlined
          @click="emit('hide', true)"
        />
        <Button
          :label="acceptLabelText"
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
