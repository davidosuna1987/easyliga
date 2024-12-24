<script setup lang="ts">
const props = defineProps({
  count: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  mono: {
    type: Boolean,
    default: false,
  },
  showError: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'maxLength:exceeded', value: boolean): void
}>()

const maxExceeded = computed(() => props.showError && props.count > props.max)

watch(maxExceeded, value => emit('maxLength:exceeded', value))
</script>

<template>
  <span
    :class="[
      'easy-character-send-component',
      {
        'text-danger': maxExceeded,
        'font-mono': mono,
      },
    ]"
  >
    {{ count }} / {{ max }}
  </span>
</template>

<script lang="ts">
export default {
  name: 'EasyCharacterCount',
}
</script>
