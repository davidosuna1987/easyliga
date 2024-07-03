<script setup lang="ts">
const slots = useSlots()
</script>

<template>
  <div class="easy-list-item-component flex justify-between p-3 rounded-lg">
    <div class="flex items-center">
      <slot />
    </div>

    <div
      v-if="slots.actions"
      class="flex items-center justify-between sm:justify-end"
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
