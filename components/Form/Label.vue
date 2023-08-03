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
  <div class="easy-form-label-component">
    <div class="easy-form-label-component__label">
      <label>{{ label }}</label>
      <small v-if="error" class="text-red-400 ml-2">{{ error }}</small>
    </div>
    <div class="easy-form-label-component__children grid mt-1">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'FormLabel',
}
</script>
