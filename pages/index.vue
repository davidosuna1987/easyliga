<script setup lang="ts">
definePageMeta({
  title: 'Easy Liga',
  description:
    'La solución integral para clubes, entrenadores y árbitros de voleibol. Simplifica la gestión, optimiza el rendimiento.',
  heroSize: 500,
  mainClass: 'guest-page',
})

useEasyHead('pages.landing.title', {
  htmlAttrs: {
    class: 'guest-page',
  },
})
</script>

<template>
  <NuxtLayout name="default">
    <template #hero>
      <WebLandingHero :size="500" />
    </template>

    <WebLanding />
  </NuxtLayout>
</template>
