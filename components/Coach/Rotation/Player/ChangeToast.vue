<script setup lang="ts">
import { CallPlayerData } from '@/domain/call'
import { PlayerChangeInOut } from '@/domain/rotation'

const props = defineProps({
  showButtonAction: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'navigate'): void
}>()

const { t } = useI18n()

const getMessage = (message: string): string =>
  message.substring(0, message.indexOf('{'))

const getPlayerChange = (message: string): PlayerChangeInOut =>
  JSON.parse(message.substring(message.indexOf('{')))
</script>

<template>
  <Toast
    class="easy-coach-player-rotation-change-toast-component"
    position="top-center"
    group="player-changes"
    @close="emit('close')"
  >
    <template #message="slotProps">
      <div class="flex flex-col">
        <p>{{ getMessage(slotProps.message.detail) }}</p>

        <RotationPlayerChangeItem
          :style="{
            width: '135%' /* 1 / 0.75 = 1.3333 + margin left */,
            height: '135%',
            transform: 'scale(0.8)',
            transformOrigin: 'top left',
          }"
          class="mt-4"
          :playerIn="getPlayerChange(slotProps.message.detail).in"
          :playerOut="getPlayerChange(slotProps.message.detail).out"
          block
        />

        <footer v-if="showButtonAction" class="flex justify-end items-center">
          <Button
            size="small"
            :label="t('rotations.show')"
            @click.prevent="emit('navigate')"
          />
        </footer>
      </div>
    </template>
  </Toast>
</template>

<script lang="ts">
export default {
  name: 'CoachRotationPlayerChangeToast',
}
</script>
