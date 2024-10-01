<script setup lang="ts">
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  reason: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['hide', 'submit'])

const { t } = useI18n()

const showDialog = ref<boolean>(props.visible)
const denyReason = ref<string>()

const handleSubmit = () => {
  emit('submit', denyReason.value)
  denyReason.value = undefined
}

watch(
  () => props.visible,
  value => (showDialog.value = value),
)

watch(
  () => props.reason,
  value => (denyReason.value = value),
)
</script>

<template>
  <DialogBottom
    class="easy-deny-reason-dialog-component"
    :visible="!!showDialog"
    @hide="emit('hide')"
  >
    <template #header>
      <Heading tag="h6">
        {{ t('player_change_requests.deny_reason_dialog_title') }}
      </Heading>
    </template>

    <template v-if="!!readonly">
      <template v-if="reason">
        <p>{{ t('player_change_requests.denied_reason') }}</p>
        <p class="mt-3">{{ reason }}</p>
      </template>
      <p v-else>{{ t('player_change_requests.deny_reason_not_specifyed') }}</p>
    </template>
    <p v-else>{{ t('player_change_requests.deny_reason_dialog_message') }}</p>

    <Textarea
      v-if="!readonly"
      class="mt-6 w-full"
      v-model="denyReason"
      :rows="5"
      :disabled="disabled"
      :readonly="readonly"
      autoResize
    />

    <template #stickyFooter>
      <FormFooterActions
        :submitLabel="t('forms.deny')"
        submitSeverity="danger"
        :size="!readonly ? 'large' : undefined"
        :full="!readonly"
        :hideSubmit="readonly"
        :hideCancel="!readonly"
        :cancelLabel="t('forms.close')"
        cancelSeverity="primary"
        :loading="disabled"
        :disabled="disabled"
        @form:submit="handleSubmit"
        @form:cancel="emit('hide')"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'RotationPlayerChangeDenyReasonDialog',
}
</script>
