<script setup lang="ts">
const slots = useSlots()
</script>

<template>
  <div
    class="easy-list-item-component flex flex-col sm:flex-row justify-between p-3 rounded-lg gap-1"
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

<style scoped>
.easy-list-item-component {
  cursor: pointer;

  &:hover {
    background-color: var(--primary-color-light);
  }
}
</style>

<script lang="ts">
export default {
  name: 'List',
}
</script>
