<script setup lang="ts">
import { Call, CallSignRequest } from '@/domain/call'
import CallService from '@/services/call'
import { Game } from '@/domain/game'
import moment from 'moment'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    required: true,
  },
  call: {
    type: Object as PropType<Call>,
    required: true,
  },
})

const emit = defineEmits(['report:signed'])

const app = useNuxtApp()
const toast = useEasyToast()
const callService = new CallService()
const showSignDialog = ref<boolean>(false)

const actionButtonDisabled = computed(() => !!props.call.signedAt)

const onActionButtonClick = () => {
  console.log(props.call)
  if (props.call.signedAt) {
    toast.error(app.$i18n.t('reports.closed'))
    return
  }
  showSignDialog.value = true
}

const submit = async () => {
  const signForm = { signedAt: moment().format('YYYY-MM-DD HH:mm:ss') }
  const { data, error } = await callService.sign(props.call.id, signForm)

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    return
  }

  toast.success(app.$i18n.t('observations.stored'))

  showSignDialog.value = false

  emit('report:signed', props.game)
}
</script>

<template>
  <Button
    class="action"
    outlined
    :label="$t('reports.sign')"
    :disabled="actionButtonDisabled"
    @click="onActionButtonClick"
  />

  <DialogBottom
    class="easy-call-sign-dialog-component"
    :visible="!!showSignDialog"
    @hide="showSignDialog = false"
  >
    <template #header>
      <Heading tag="h6">{{ $t('reports.sign') }}</Heading>
    </template>

    <p>{{ $t('reports.sign_disclaimer') }}</p>

    <template #footer>
      <div class="flex justify-end gap-3 mt-3">
        <Button
          class="grayscale"
          :label="$t('forms.cancel')"
          severity="info"
          outlined
          @click="showSignDialog = false"
        />
        <Button :label="$t('forms.sign')" @click="submit" />
      </div>
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'CoachButtonSign',
}
</script>
