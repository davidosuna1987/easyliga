<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation'],
})

useEasyHead('pages.league.index.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-federation-league-show-page">
      <LeagueShow showActions />
    </div>
  </NuxtLayout>
</template>
