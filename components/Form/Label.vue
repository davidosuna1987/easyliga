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
  required: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <label
    :class="[
      'easy-form-label-component flex flex-col',
      { 'font-bold': strong },
    ]"
  >
    <div class="flex items-end mb-1">
      <span>{{ label }}</span>
      <span v-if="required">*</span>
      <small v-if="error" class="text-red-400 ml-2">{{ error }}</small>
    </div>
    <slot />
  </label>
</template>

<script lang="ts">
export default {
  name: 'FormLabel',
}
</script>
