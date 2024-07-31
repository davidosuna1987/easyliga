<script setup lang="ts">
const props = defineProps({
  hierarchy: {
    type: Number,
    default: 1,
  },
  hoverable: {
    type: Boolean,
    default: true,
  },
})
const slots = useSlots()

const styles = computed(() => {
  return {
    '--margin-left': `calc(2rem * ${props.hierarchy - 1})`,
  }
})

const hasParent = computed(() => props.hierarchy > 1)
</script>

<template>
  <div
    :class="[
      'easy-list-item-component flex flex-col sm:flex-row justify-between py-3 rounded-lg gap-1',
      {
        'has-parent': hasParent,
        'px-3 cursor-pointer hover:bg-[var(--highlight-color-alpha)]':
          props.hoverable,
      },
    ]"
    :style="styles"
  >
    <div class="flex items-center">
      <slot />
    </div>

    <div
      v-if="slots.actions"
      class="flex items-center justify-end sm:justify-end gap-3"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.easy-list-item-component {
  &.has-parent {
    position: relative;
    margin-left: var(--margin-left);

    &:before {
      content: '';
      width: 0.75rem;
      height: 50%;
      position: absolute;
      left: -1rem;
      top: 0;
      border: solid 1px;
      border-color: transparent transparent var(--text-color) var(--text-color);
    }

    &:after {
      content: '';
      width: 0.5rem;
      height: 0.5rem;
      position: absolute;
      left: -0.8rem;
      top: calc(50% - 0.3rem);
      border: solid 1px;
      border-color: var(--text-color) var(--text-color) transparent transparent;
      transform: rotate(45deg);
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'List',
}
</script>
