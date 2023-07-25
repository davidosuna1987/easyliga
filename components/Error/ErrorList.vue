<script setup lang="ts">
import { ApiError } from '@/domain/errors'

const props = defineProps({
  errors: {
    type: Array<ApiError>,
    required: true,
  },
})
</script>

<template>
  <div class="easy-error-list">
    <p v-if="errors.length === 1">{{ errors.at(0) }}</p>
    <ul v-else-if="errors.length > 1">
      <li v-for="(error, i) in errors" :key="i">
        {{ error }}
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
