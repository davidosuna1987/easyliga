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

const actionButtonDisabled = computed(() => !!props.call.signedAt)

const setObservations = (observations?: string) => {
  form.value.observations = observations
}

const onActionButtonClick = () => {
  console.log(props.call)
  if (props.call.signedAt) {
    toast.error(app.$i18n.t('reports.closed'))
    return
  }
  showObservationsDialog.value = true
}

const submit = async () => {
  if (!form.value.observations && !props.call.observations) {
    showObservationsDialog.value = false
    return
  }
  const { data, error } = await callService.observations(
    props.call.id,
    form.value,
  )

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    return
  }

  toast.success(app.$i18n.t('observations.stored'))

  showObservationsDialog.value = false
}
</script>

<template>
  <Button
    class="action"
    outlined
    :label="$t('observations.observation', 2)"
    :disabled="actionButtonDisabled"
    @click="onActionButtonClick"
  />

  <ObservationsDialog
    :visible="!!showObservationsDialog"
    :observations="form.observations"
    @hide="showObservationsDialog = false"
    @observations:changed="setObservations"
    @submit="submit"
  />
</template>

<script lang="ts">
export default {
  name: 'CoachButtonObservations',
}
</script>
