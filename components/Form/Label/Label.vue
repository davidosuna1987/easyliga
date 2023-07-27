<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  error: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <div class="easy-form-label-component flex items-center">
    <label for="email">{{ label }}</label>
    <small v-if="error" class="text-red-400 ml-2">{{ error }}</small>
  </div>
</template>

<style scoped></style>
