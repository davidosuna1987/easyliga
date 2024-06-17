import LoadingVue from 'components/Loading.vue'; import { log } from 'console';
import rotationVue from
'pages/coach/games/[game_id]/calls/[call_id]/rotation.vue';
<script setup lang="ts">
import RotationService from '@/services/rotation'
import { MAX_ROTATION_PLAYER_CHANGES, Rotation } from '@/domain/rotation'
import { Timeout } from '@/domain/timeout'
import { GameStatus } from '@/domain/game'

const props = defineProps({
  rotation: {
    type: Object as PropType<Rotation>,
    required: true,
  },
  requestedTimeout: {
    type: Object as PropType<Timeout>,
    required: false,
  },
  runningTimeout: {
    type: Object as PropType<Timeout>,
    required: false,
  },
  gameStatus: {
    type: String as PropType<GameStatus>,
    required: true,
  },
})

const emit = defineEmits(['rotation:lock-toggled'])

const { t } = useI18n()
const toast = useEasyToast()
const rotationService = new RotationService()

const loadingApi = ref<boolean>(false)

const unlock = async () => {
  if (!props.rotation || !props.rotation.locked) return

  loadingApi.value = true
  const { data, error } = await rotationService.unlock(props.rotation.id)
  loadingApi.value = false

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    return
  }

  emit('rotation:lock-toggled', true)
}

const lock = async () => {
  if (!props.rotation || props.rotation.locked) return

  loadingApi.value = true
  const { data, error } = await rotationService.lock(props.rotation.id)
  loadingApi.value = false

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    return
  }

  emit('rotation:lock-toggled', true)
}
</script>

<template>
  <div
    class="easy-game-rotation-status-component flex items-center"
    :class="{
      'justify-between':
        props.rotation.locked &&
        !props.requestedTimeout &&
        !props.runningTimeout,
      'p-[0.5rem]':
        !props.rotation.locked ||
        props.requestedTimeout ||
        props.runningTimeout,
    }"
  >
    <Loading v-if="loadingApi" />

    <Button
      v-if="
        props.gameStatus !== 'finished' &&
        props.gameStatus !== 'warmup' &&
        props.rotation.playerChangesCount < MAX_ROTATION_PLAYER_CHANGES
      "
      class="unlock-button text-xs px-[0.5rem] py-[0.25rem]"
      :severity="props.rotation.locked ? 'primary' : 'danger'"
      :label="props.rotation.locked ? t('forms.unlock') : t('forms.lock')"
      @click="props.rotation.locked ? unlock() : lock()"
    />
    <template
      v-if="
        !props.rotation.locked || props.requestedTimeout || props.runningTimeout
      "
    >
      <FormSpinner size="0.75rem" />
      <small>{{
        props.requestedTimeout
          ? t('timeouts.requested_short')
          : props.runningTimeout
          ? t('timeouts.running')
          : t('rotations.waiting_player_changes', 2)
      }}</small>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameRotationStatus',
}
</script>
