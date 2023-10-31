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
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['sanction:selected'])

const colorClass = computed((): string =>
  props.severity === SanctionSeverity.point
    ? props.disabled
      ? 'text-[var(--tertiary-color)]'
      : 'text-[var(--danger-color)]'
    : 'text-[var(--tertiary-color)]',
)
</script>

<template>
  <div
    class="easy-sanction-item-component flex justify-center items-center"
    :class="[
      `severity-${props.severity}`,
      {
        'is-selected': props.selected,
        'is-muted': props.disabled,
      },
    ]"
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
.easy-sanction-item-component {
  border: solid 2px transparent;
  border-radius: 1rem;

  &.severity-set {
    .severity-item {
      &:first-child {
        position: relative;
        left: 12.5%;
        z-index: 1;
      }

      &:last-child {
        position: relative;
        right: 12.5%;
      }
    }
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
