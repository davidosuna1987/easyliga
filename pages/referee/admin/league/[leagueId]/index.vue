<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['referee_admin'],
})

useEasyHead('pages.league.index.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-referee-admin-league-show-page">
      <LeagueShow />
    </div>
  </NuxtLayout>
</template>
