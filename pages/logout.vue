<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'

definePageMeta({
  middleware: ['auth'],
})

const auth = useAuthStore()
auth.logout()
</script>

<template>
  <div class="easy-logout-page">
    <h1>Logout page</h1>
  </div>
</template>

<style scoped></style>
