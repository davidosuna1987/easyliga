<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation'],
})

useEasyHead('pages.league.index.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-league-show-page">
      <LeagueShow />
    </div>
  </NuxtLayout>
</template>
