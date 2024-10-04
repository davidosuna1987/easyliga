<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation'],
})

useEasyHead('pages.federation.league.create.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-federations-league-create-page">
      <FederationLeagueCreate />
    </div>
  </NuxtLayout>
</template>
