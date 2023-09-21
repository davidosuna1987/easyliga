<script setup lang="ts">
const props = defineProps({
  size: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
})

const sizeClass = computed(() => {
  return props.size ? `size-${props.size}` : ''
})
</script>

<template>
  <div class="easy-player-item-icon-component" :class="[sizeClass]">
    <Icon :name="name" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'PlayerItemIcon',
}
</script>
