<script setup lang="ts">
const props = defineProps({
  shirtNumber: {
    type: Number,
    required: true,
  },
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
  <div class="easy-icon-shirt-number-component" :class="[sizeClass]">
    {{ shirtNumber }}
  </div>
</template>

<script lang="ts">
export default {
  name: 'IconShirtNumber',
}
</script>
