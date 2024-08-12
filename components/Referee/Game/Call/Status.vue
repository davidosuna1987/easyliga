<script setup lang="ts">
import CallService from '@/services/call'
import { Call } from '@/domain/call'
import { Set } from '@/domain/set'
import { GameStatus } from '@/domain/game'

const props = defineProps({
  call: {
    type: Object as PropType<Call>,
    required: true,
  },
  currentSet: {
    type: Object as PropType<Set>,
    required: true,
  },
  gameStatus: {
    type: String as PropType<GameStatus>,
    required: false,
  },
})

const emit = defineEmits(['call:unlocked'])

const { t } = useI18n()
const toast = useEasyToast()
const callService = new CallService()

const unlock = async () => {
  if (!props.call || !props.call.locked) return

  const { data, error } = await callService.unlock(props.call.id)

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    return
  }

  emit('call:unlocked', true)
}
</script>

<template>
  <div
    class="easy-game-call-status-component flex items-center"
    :class="{ 'justify-between': props.call.locked && !!gameStatus }"
  >
    <template v-if="props.call.locked && !!gameStatus">
      <div class="flex items-center">
        <FormSpinner size="0.75rem" />
        <small>{{ t('rotations.waiting') }}</small>
      </div>
    </template>
    <template v-else>
      <FormSpinner size="0.75rem" />
      <small>{{ t('calls.waiting') }}</small>
    </template>

    <Button
      v-if="
        props.currentSet.number === 1 &&
        props.gameStatus !== 'finished' &&
        props.gameStatus !== 'warmup'
      "
      class="unlock-button text-xs px-[0.5rem] py-[0.25rem]"
      :label="t('forms.unlock')"
      @click="unlock()"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameCallStatus',
}
</script>
