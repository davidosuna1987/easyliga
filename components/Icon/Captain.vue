<script setup lang="ts">
const props = defineProps({
  size: {
    type: String,
    required: false,
  },
})

const sizeClass = computed(() => {
  return props.size ? `size-${props.size}` : ''
})
</script>

<template>
  <div class="easy-icon-captain-component" :class="[sizeClass]">C</div>
</template>

<script lang="ts">
export default {
  name: 'IconCaptain',
}
</script>
