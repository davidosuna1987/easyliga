<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
const auth = useAuthStore()
</script>

<template>
  <NuxtLoadingIndicator />
  <NavbarAuth v-if="auth.isLoggedIn" />
  <NavbarGuest v-else />
</template>
