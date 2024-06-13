import { emit } from 'process'; import { emit } from 'process';
<script setup lang="ts">
import { Set } from '@/domain/set'
import { Team } from '@/domain/team'
import {
  Timeout,
  TimeoutStatusEnum,
  TimeoutStoreRequest,
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
})

const emit = defineEmits(['hide', 'timeout:init'])

const { t } = useI18n()
const toast = useEasyToast()

const timeoutService = new TimeoutService()

const showDialog = ref<boolean>(props.visible)
const loadingApi = ref<boolean>(false)

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

watch(
  () => props.visible,
  value => (showDialog.value = value),
)
</script>
<template>
  <DialogBottom
    class="easy-game-timeout-dialog-component"
    :visible="!!showDialog"
    @hide="emit('hide')"
  >
    <template #header>
      <Heading tag="h6">{{ t('timeouts.timeout') }}</Heading>
    </template>

    <p class="text-center my-3">{{ t('timeouts.init_alert') }}</p>
    <Heading tag="h5" class="mt-3 text-center">
      {{ props.team.name }}
    </Heading>

    <template #footer>
      <FormFooterActions
        :submitLabel="t('timeouts.init')"
        :disabled="loadingApi"
        @form:submit="storeTimeout"
        @form:cancel="emit('hide')"
      />>
    </template>
  </DialogBottom>
</template>
