<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['referee_admin'],
})

useEasyHead('pages.federation.leagues.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-leagues-page">
      <LeagueList isRefereeAdmin />
    </div>
  </NuxtLayout>
</template>
