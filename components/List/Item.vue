<script setup lang="ts">
const props = defineProps({
  hoverable: {
    type: Boolean,
    default: true,
  },
})
const slots = useSlots()
</script>

<template>
  <div
    :class="[
      'easy-list-item-component flex flex-col sm:flex-row justify-between py-3 rounded-lg gap-1',
      {
        'px-3 cursor-pointer hover:bg-[var(--primary-color-light)]':
          props.hoverable,
      },
    ]"
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

<script lang="ts">
export default {
  name: 'List',
}
</script>
