<script setup lang="ts">
import { TeamType } from '@/domain/team'

const props = defineProps({
  undoPointButtonDisabled: {
    type: Boolean,
    required: true,
  },
  undoLastPointCountdown: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['point:sum', 'point:undo'])

const sumPoint = (type: TeamType) => {
  emit('point:sum', type)
}

const undoLastPoint = () => {
  emit('point:undo')
}
</script>

<template>
  <div class="easy-game-point-actions-component grid grid-cols-3 gap-4">
    <Button
      class="col-span-3/10"
      :class="undoPointButtonDisabled ? '' : 'grayscale'"
      :label="$t('points.sum')"
      outlined
      :disabled="!undoPointButtonDisabled"
      @click="sumPoint('local')"
    />
    <Button
      class="col-span-4/10"
      :class="undoPointButtonDisabled ? 'grayscale' : ''"
      :label="$t('points.undo')"
      outlined
      severity="danger"
      :disabled="undoPointButtonDisabled"
      @click="undoLastPoint"
    />
    <Button
      class="col-span-3/10"
      :class="undoPointButtonDisabled ? '' : 'grayscale'"
      :label="$t('points.sum')"
      outlined
      :disabled="!undoPointButtonDisabled"
      @click="sumPoint('visitor')"
    />
  </div>
  <small v-if="!undoPointButtonDisabled" class="countdown inline-block mt-2">{{
    $t('points.undo_countdown', { seconds: undoLastPointCountdown })
  }}</small>
</template>

<script lang="ts">
export default {
  name: 'GamePointActions',
}
</script>

<style lang="scss">
.countdown {
  color: var(--danger-color);
}
</style>
