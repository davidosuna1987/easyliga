<script setup lang="ts">
import { League } from '@/domain/league'

definePageMeta({
  title: 'pages.classification.title',
  description: 'pages.classification.description',
  heroSize: 500,
  mainClass: 'guest-page',
})

useEasyHead('pages.classification.title', {
  htmlAttrs: {
    class: 'guest-page',
  },
})

const selectedLeague = ref<League>()

const setSelectedLeague = (league?: League) => {
  selectedLeague.value = league
}
</script>

<template>
  <NuxtLayout name="default">
    <template #hero>
      <WebClassificationHero @league:selected="setSelectedLeague" />
    </template>

    <WebClassificationContent class="pb-10" :selectedLeague="selectedLeague" />
  </NuxtLayout>
</template>
