<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { User } from '@/types/api/auth'

const auth = useAuthStore()
const authuser = computed((): User | null => auth.user)
</script>

<template>
  <div class="sidebar-left-layout">
    <NavbarAuth v-if="authuser" />
    <NavbarGuest v-else />

    <main class="easy-main">
      <aside class="easy-sidebar easy-sidebar-left">
        <slot name="sidebar" />
      </aside>
      <section class="easy-container">
        <slot />
      </section>
    </main>

    <Footer />
  </div>
</template>
