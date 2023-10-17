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
    default: () => useNuxtApp().$i18n.t('forms.submit'),
  },
})

const emit = defineEmits(['hide', 'observations:changed', 'submit'])

const showDialog = ref<boolean>(props.visible)
const form = ref<{ observations?: string }>({
  observations: props.observations,
})

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
      <Heading tag="h6">{{ $t('observations.observation', 2) }}</Heading>
    </template>

    <p>{{ $t('observations.record_text') }}</p>

    <Textarea
      class="mt-6 w-full"
      v-model="form.observations"
      :rows="5"
      autoResize
      @update:modelValue="emit('observations:changed', form.observations)"
    />

    <template #footer>
      <div class="flex justify-end gap-3 mt-3">
        <Button
          class="grayscale"
          :label="$t('forms.cancel')"
          severity="info"
          outlined
          @click="emit('hide')"
        />
        <Button :label="props.submitLabel" @click="emit('submit')" />
      </div>
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'ObservationsDialog',
}
</script>
