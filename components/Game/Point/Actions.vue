<script setup lang="ts">
import { TeamType } from '@/domain/team'
import { Set, SetSide } from '@/domain/set'

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
    <EasyGrid class="actions" :cols="3" :gap="4">
      <Button
        class="col-span-3/10 transition-none"
        :class="undoPointButtonDisabled ? '' : 'grayscale p-button-outlined'"
        :label="$t('points.sum')"
        :disabled="!undoPointButtonDisabled"
        @click="
          sumPoint(
            currentSet.localTeamSide === SetSide.LEFT
              ? TeamType.LOCAL
              : TeamType.VISITOR,
          )
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
        class="col-span-3/10 transition-none"
        :class="undoPointButtonDisabled ? '' : 'grayscale p-button-outlined'"
        :label="$t('points.sum')"
        :disabled="!undoPointButtonDisabled"
        @click="
          sumPoint(
            currentSet.localTeamSide === SetSide.LEFT
              ? TeamType.VISITOR
              : TeamType.LOCAL,
          )
        "
      />
    </EasyGrid>
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
