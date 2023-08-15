<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    default: 'var(--text-color)',
  },
  background: {
    type: String,
    default: 'transparent',
  },
  size: {
    type: String,
    default: '1rem',
  },
  borderWidth: {
    type: String,
    default: '1px',
  },
  marginRight: {
    type: String,
    default: '0.5rem',
  },
})

const styles = computed(() => ({
  container: {
    display: 'inline-flex',
    width: props.size,
    height: props.size,
    'margin-right': props.marginRight,
  },
  icon: {
    width: props.size,
    height: props.size,
    border: `solid ${props.borderWidth} ${props.color}`,
    'border-top-color': props.background,
    'border-radius': '50%',
  },
}))
</script>

<template>
  <div class="easy-form-spinner" role="status" :style="styles.container">
    <span class="icon animate-spin" :style="styles.icon"></span>
    <span class="sr-only">{{ $t('forms.loading') }}...</span>
  </div>
</template>
