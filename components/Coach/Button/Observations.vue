<script setup lang="ts">
import { Call, CallObservationsRequest } from '@/domain/call'
import CallService from '@/services/call'

const props = defineProps({
  call: {
    type: Object as PropType<Call>,
    required: true,
  },
})

const app = useNuxtApp()
const toast = useEasyToast()
const callService = new CallService()

const form = ref<CallObservationsRequest>({
  observations: props.call.observations,
})
const showObservationsDialog = ref<boolean>(false)

const submit = async () => {
  const { data, error } = await callService.observations(
    props.call.id,
    form.value,
  )

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    return
  }

  toast.success(app.$i18n.t('calls.observations_stored'))

  showObservationsDialog.value = false
}
</script>

<template>
  <Button
    class="action"
    outlined
    :label="$t('games.observation', 2)"
    @click="showObservationsDialog = true"
  />

  <DialogBottom
    class="easy-coach-observations-dialog-component"
    :visible="!!showObservationsDialog"
    @hide="showObservationsDialog = false"
  >
    <template #header>
      <Heading tag="h6">{{ $t('games.observation', 2) }}</Heading>
    </template>

    <p>{{ $t('games.observations_disclaimer') }}</p>

    <Textarea
      class="mt-6 w-full"
      v-model="form.observations"
      :rows="5"
      autoResize
    />

    <template #footer>
      <div class="flex justify-end gap-3 mt-3">
        <Button
          class="grayscale"
          :label="$t('forms.cancel')"
          severity="info"
          outlined
          @click="showObservationsDialog = false"
        />
        <Button :label="$t('forms.submit')" @click="submit" />
      </div>
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'CoachButtonObservations',
}
</script>
