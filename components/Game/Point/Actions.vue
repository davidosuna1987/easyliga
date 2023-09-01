<script setup lang="ts">
import { TeamType } from '@/domain/team'
import { Set } from '@/domain/set'

const props = defineProps({
  currentSet: {
    type: Object as PropType<Set>,
    required: true,
  },
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
  <div class="easy-game-point-actions-component">
    <div class="actions grid grid-cols-3 gap-4">
      <Button
        class="col-span-3/10"
        :class="undoPointButtonDisabled ? '' : 'grayscale'"
        :label="$t('points.sum')"
        outlined
        :disabled="!undoPointButtonDisabled"
        @click="
          sumPoint(currentSet.localTeamSide === 'left' ? 'local' : 'visitor')
        "
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
        @click="
          sumPoint(currentSet.localTeamSide === 'left' ? 'visitor' : 'local')
        "
      />
    </div>
    <small v-if="!undoPointButtonDisabled" class="countdown inline-block mt-2">
      {{ $t('points.undo_countdown', { seconds: undoLastPointCountdown }) }}
    </small>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GamePointActions',
}
</script>

<style lang="scss">
.easy-game-point-actions-component {
  max-width: var(--court-max-width);
  margin: 0 auto;
}

.countdown {
  color: var(--danger-color);
}
</style>
