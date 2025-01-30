<script setup lang="ts">
const props = defineProps({
  left: {
    type: String,
    required: false,
  },
  right: {
    type: String,
    required: false,
  },
  background: {
    type: String,
    default: 'primary-color',
  },
  color: {
    type: String,
    default: 'white',
  },
})

const style = computed(() => {
  return {
    '--background': `var(--${props.background})`,
    '--color': props.color,
  }
})
</script>

<template>
  <div class="easy-double-chip-component" :style="style">
    <span class="chip left">{{ left }}</span>
    <span v-if="right" class="chip right">{{ right }}</span>
  </div>
</template>

<style scoped lang="scss">
.easy-double-chip-component {
  white-space: nowrap;
  display: inline-flex;
  flex-wrap: nowrap;
  border-radius: 0.25rem;
  overflow: hidden;
}

.chip {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem 0.125rem;
  font-size: 0.85rem;

  &.whitelisted {
    background-color: var(--success-color);
    color: var(--darken-color);
    border-radius: 0.25rem;
  }

  &.left {
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
    background-color: var(--background);
    color: var(--color);
  }

  &.right {
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    border: solid 1px var(--background);
    color: var(--background);
  }

  &.active {
    border-radius: 0.25rem;
    background-color: var(--success-color);
    color: var(--darken-color);
  }

  &.canceled {
    border-radius: 0.25rem;
    background-color: var(--danger-color);
    color: var(--darken-color);
  }
}
</style>

<script lang="ts">
export default {
  name: 'EasyDoubleChip',
}
</script>
