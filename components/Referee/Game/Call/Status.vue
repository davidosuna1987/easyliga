<script setup lang="ts">
import CallService from '@/services/call'
import { Call } from '@/domain/call'
import { emit } from 'process'

const toast = useEasyToast()
const callService = new CallService()
const emit = defineEmits(['unlocked'])

const props = defineProps({
  call: {
    type: Object as PropType<Call>,
    required: true,
  },
})

const unlock = async () => {
  if (!props.call || !props.call.locked) return

  const { data, error } = await callService.unlock(props.call.id)

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    return
  }

  emit('unlocked', true)
}
</script>

<template>
  <div
    class="easy-game-call-status-component flex items-center"
    :class="{ 'justify-between': props.call.locked }"
  >
    <template v-if="props.call.locked">
      <small></small>
      <Button
        class="text-xs px-[0.5rem] py-[0.25rem]"
        :label="$t('forms.unlock')"
        @click="unlock()"
      />
    </template>
    <template v-else>
      <FormSpinner size="0.75rem" />
      <small>{{ $t('calls.waiting') }}</small>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameCallStatus',
}
</script>
