<script setup lang="ts">
import { ApiError } from '@/domain/errors'

type Error = string

const props = defineProps({
  errors: {
    type: Array<ApiError<Error>>,
    required: true,
  },
})
</script>

<template>
  <div class="easy-error-list-component">
    <p v-if="errors.length === 1"></p>
    <ul v-else-if="errors.length > 1">
      <li v-for="(error, index) in errors" :key="index">
        {{ error }}
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
