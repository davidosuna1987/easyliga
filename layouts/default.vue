<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { User } from '@/types/api/auth'

const auth = useAuthStore()
const authuser = computed((): User | null => auth.user)
</script>

<template>
  <div class="default-layout">
    <NavbarAuth v-if="authuser" />
    <NavbarGuest v-else />

    <main class="easy-main">
      <section class="easy-container">
        <slot />
      </section>
    </main>

    <Footer />
  </div>
</template>
