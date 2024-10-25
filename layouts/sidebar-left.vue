<script setup lang="ts">
import { ApiUser } from '@/types/api/user'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
const authuser = computed((): ApiUser | null => auth.user)
const toggleClass = ref<string>('closed')
</script>

<template>
  <div
    class="sidebar-left-layout"
    :class="[`sidebar-${toggleClass}`, $route.meta.layoutClass]"
  >
    <NuxtLoadingIndicator />
    <NavbarAuth v-if="authuser" />
    <NavbarGuest v-else />

    <main class="easy-main" :class="$route.meta.mainClass">
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

      <section class="easy-container" :class="$route.meta.containerClass">
        <slot />
      </section>
    </main>

    <Footer />
  </div>
</template>
