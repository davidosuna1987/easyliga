<script setup lang="ts">
import { SanctionSeverity } from '@/domain/sanction'

const props = defineProps({
  severity: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: '5rem',
  },
  color: {
    type: String,
    required: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['sanction:selected'])

const colorClass = computed((): string =>
  props.severity === SanctionSeverity.point
    ? 'text-[var(--danger-color)]'
    : 'text-[var(--tertiary-color)]',
)
</script>

<template>
  <div
    class="easy-severity-item-component flex justify-center items-center"
    :class="[`severity-${props.severity}`, { 'is-selected': props.selected }]"
    @click="emit('sanction:selected', props.severity)"
  >
    <Icon
      class="severity-item"
      name="tabler:rectangle-vertical-filled"
      :size="props.size"
      :class="[props.color ? props.color : colorClass]"
    />
    <Icon
      v-if="
        [SanctionSeverity.set, SanctionSeverity.game].includes(props.severity)
      "
      class="severity-item"
      name="tabler:rectangle-vertical-filled"
      :size="props.size"
      :class="[props.color ? props.color : 'text-[var(--danger-color)]']"
    />
  </div>
</template>

<style scoped lang="scss">
.easy-severity-item-component {
  border: solid 2px transparent;
  border-radius: 1rem;
  padding: 1rem;

  &.severity-set {
    .severity-item {
      &:first-child {
        position: relative;
        left: 1.5rem;
        z-index: 1;
      }

      &:last-child {
        position: relative;
        right: 1.5rem;
      }
    }
  }

  &:hover {
    cursor: pointer;
    border-color: var(--primary-color-medium);
  }

  &.is-selected {
    border-color: var(--primary-color);
    background-color: var(--primary-color-lightest);
  }
}
</style>

<script lang="ts">
export default {
  name: 'SanctionItem',
}
</script>
