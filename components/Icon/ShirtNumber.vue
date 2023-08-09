<script setup lang="ts">
const props = defineProps({
  shirtNumber: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="easy-icon-shirt-number-component">{{ shirtNumber }}</div>
</template>

<script lang="ts">
export default {
  name: 'IconShirtNumber',
}
</script>
