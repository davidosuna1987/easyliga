<script setup lang="ts">
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  observations: {
    type: String,
    required: false,
  },
  submitLabel: {
    type: String,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'hide',
  'observations:changed',
  'observations:submit',
])

const { t } = useI18n()

const showDialog = ref<boolean>(props.visible)
const form = ref<{ observations?: string }>({
  observations: props.observations,
})

const submitLabelText = computed(() => props.submitLabel ?? t('forms.submit'))

watch(
  () => props.visible,
  value => (showDialog.value = value),
)

watch(
  () => props.observations,
  value => (form.value.observations = value),
)
</script>

<template>
  <DialogBottom
    class="easy-observations-dialog-component"
    :visible="!!showDialog"
    @hide="emit('hide')"
  >
    <template #header>
      <Heading tag="h6">{{ t('observations.observation', 2) }}</Heading>
    </template>

    <p>{{ t('observations.record_text') }}</p>

    <Textarea
      class="mt-6 w-full"
      v-model="form.observations"
      :rows="5"
      autoResize
      @update:modelValue="emit('observations:changed', form.observations)"
    />

    <template #footer>
      <FormFooterActions
        :submitLabel="submitLabelText"
        :disabled="loading"
        @form:submit="emit('observations:submit')"
        @form:cancel="emit('hide')"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'ObservationsDialog',
}
</script>
