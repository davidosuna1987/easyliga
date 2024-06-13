<script setup lang="ts">
const props = defineProps({
  size: {
    type: Number,
    default: 16,
  },
  icon: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'primary',
  },
  outlined: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div
    :class="[
      `easy-form-action-icon-component cursor-pointer p-1 rounded-full`,
      outlined
        ? `border-${type}-1 text-${type} hover:bg-${type}`
        : `border-${type}-1 bg-${type} hover:bg-${type}-dark`,
    ]"
  >
    <Icon :name="icon" :size="String(size)" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'FormActionIcon',
}
</script>
