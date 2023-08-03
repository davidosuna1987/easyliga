<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { User } from '@/types/api/auth'

const auth = useAuthStore()
const authuser = computed((): User | null => auth.user)
const toggleClass = ref<string>('closed')
</script>

<template>
  <div class="sidebar-left-layout" :class="[`sidebar-${toggleClass}`]">
    <NavbarAuth v-if="authuser" />
    <NavbarGuest v-else />

    <main class="easy-main">
      <aside class="easy-sidebar easy-sidebar-left">
        <a
          role="button"
          tabindex="0"
          class="easy-sidebar-toggle open"
          @click.prevent="toggleClass = 'opened'"
        >
          <Icon name="ic:round-keyboard-double-arrow-right" />
        </a>
        <a
          role="button"
          tabindex="0"
          class="easy-sidebar-toggle close"
          @click.prevent="toggleClass = 'closed'"
        >
          <Icon name="ic:outline-close" />
        </a>
        <slot name="sidebar" />
      </aside>
      <section class="easy-container">
        <slot />
      </section>
    </main>

    <Footer />
  </div>
</template>
