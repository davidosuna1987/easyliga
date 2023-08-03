<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  strong: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <div class="easy-form-label-component">
    <div class="easy-form-label-component__label">
      <label :class="{ 'font-bold': strong }">{{ label }}</label>
      <small v-if="error" class="text-red-400 ml-2">{{ error }}</small>
    </div>
    <div class="easy-form-label-component__children grid mt-1">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.easy-form-label-component__children > :first-child {
  max-width: 100%;
  overflow: hidden;
}
</style>

<script lang="ts">
export default {
  name: 'FormLabel',
}
</script>
