<script setup lang="ts">
import { User, useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
const authuser = computed((): User | null => auth.user)
</script>

<template>
  <div class="default-layout">
    <NavbarGuest />

    <main class="easy-main">
      <section class="easy-container">
        <ul>
          <li>
            <NuxtLink to="/">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/login">Login</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/register">Register</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/verify/1/token">Verify</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/forgot">Forgot</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/reset/token">Reset</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/logout">Logout</NuxtLink>
          </li>
        </ul>

        <pre>{{ authuser }}</pre>

        <slot />
      </section>
    </main>

    <Footer />
  </div>
</template>
