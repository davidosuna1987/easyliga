<script setup lang="ts">
const props = defineProps({
  errors: {
    type: Object as PropType<string[]>,
    required: true,
  },
})
</script>

<template>
  <div class="easy-error-list">
    <p v-if="errors.length === 1">{{ errors[0] }}</p>
    <ul v-else-if="errors.length > 1">
      <li v-for="(error, i) in errors" :key="i">
        {{ error }}
      </li>
    </ul>
  </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'ErrorList',
}
</script>
