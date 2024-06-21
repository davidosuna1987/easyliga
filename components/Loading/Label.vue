<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: '1rem',
  },
})

const borderWidth = computed(() => `${Math.ceil(parseFloat(props.size))}px`)

const styles = computed(() => ({
  label: {
    'margin-left': '0.25rem',
    'font-size': props.size,
  },
}))
</script>

<template>
  <div class="easy-loading-label-component flex items-center">
    <FormSpinner :size="size" :borderWidth="borderWidth" />
    <span class="label" :style="styles.label">{{ label }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LoadingLabel',
}
</script>
