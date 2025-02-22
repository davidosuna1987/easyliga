import { emit } from 'process'; import { emit } from 'process';
<script setup lang="ts">
import { Set } from '@/domain/set'
import { Team } from '@/domain/team'
import {
  Timeout,
  TimeoutStatusEnum,
  TimeoutStoreRequest,
  TimeoutUpdateRequest,
  mapApiTimeoutToTimeout,
} from '@/domain/timeout'
import TimeoutService from '@/services/timeout'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  team: {
    type: Object as PropType<Team>,
    required: true,
  },
  timeouts: {
    type: Array as PropType<Timeout[]>,
    required: true,
  },
  currentSet: {
    type: Object as PropType<Set>,
    required: true,
  },
  timeoutToStop: {
    type: Object as PropType<Timeout>,
    required: false,
  },
  timeoutRunningDuration: {
    type: String,
    required: false,
  },
  closable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'hide'): void
  (e: 'timeout:init', value: Timeout): void
  (e: 'timeout:stop', value: Timeout): void
}>()

const { t } = useI18n()
const toast = useEasyToast()

const timeoutService = new TimeoutService()

const showDialog = ref<boolean>(props.visible)
const loadingApi = ref<boolean>(false)

const handleSubmit = async () => {
  if (props.timeoutToStop) {
    await stopTimeout()
  } else {
    await storeTimeout()
  }
}

const storeTimeout = async () => {
  const storeTimeoutForm: TimeoutStoreRequest = {
    setId: props.currentSet.id,
    teamId: props.team.id,
    status: TimeoutStatusEnum.running,
  }

  loadingApi.value = true
  const { data, error } = await timeoutService.store(storeTimeoutForm)
  loadingApi.value = false

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value?.data) {
    emit('timeout:init', mapApiTimeoutToTimeout(data.value.data.timeout))
  }
}

const stopTimeout = async () => {
  if (!props.timeoutToStop) return

  const storeTimeoutForm: TimeoutUpdateRequest = {
    status: TimeoutStatusEnum.finished,
  }

  loadingApi.value = true
  const { data, error } = await timeoutService.update(
    props.timeoutToStop.id,
    storeTimeoutForm,
  )
  loadingApi.value = false

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value?.data) {
    emit('timeout:stop', mapApiTimeoutToTimeout(data.value.data.timeout))
  }
}

watch(
  () => props.visible,
  value => (showDialog.value = value),
)
</script>

<template>
  <DialogBottom
    class="easy-timeout-dialog-component"
    :visible="!!showDialog"
    :closable="props.closable"
    :dismissable-mask="props.closable"
    @hide="emit('hide')"
  >
    <template #header>
      <Heading tag="h6">{{ t('timeouts.timeout') }}</Heading>
    </template>

    <p v-if="!props.timeoutToStop" class="text-center my-3">
      {{
        props.timeoutToStop
          ? t('timeouts.stop_alert')
          : t('timeouts.init_alert')
      }}
    </p>
    <Heading tag="h5" class="mt-3 text-center">
      {{ props.team.name }}
    </Heading>
    <div
      v-if="props.timeoutToStop && props.timeoutRunningDuration"
      class="flex justify-center items-center mt-3 text-3xl"
    >
      <pre>{{ props.timeoutRunningDuration }}</pre>
    </div>

    <template #stickyFooter>
      <FormFooterActions
        :hideCancel="!props.closable"
        :submitLabel="
          props.timeoutToStop ? t('timeouts.stop') : t('timeouts.init')
        "
        :full="!!props.timeoutToStop"
        :submit-severity="props.timeoutToStop ? 'danger' : 'primary'"
        :size="props.timeoutToStop ? 'large' : undefined"
        :disabled="loadingApi"
        @form:submit="handleSubmit"
        @form:cancel="emit('hide')"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'TimeoutDialog',
}
</script>
