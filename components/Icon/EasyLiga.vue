<script setup lang="ts">
const props = defineProps({
  size: {
    type: String,
    default: '38',
  },
})
</script>

<template>
  <div class="easy-icon-easy-liga-component">
    <NuxtImg
      src="/logos/easyliga.svg"
      quality="100"
      :width="size"
      :height="size"
      fit="contain"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'IconEasyLiga',
}
</script>
