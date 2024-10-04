<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation'],
})

useEasyHead('pages.federation.league.edit.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-federations-league-edit-page">
      <FederationLeagueEdit />
    </div>
  </NuxtLayout>
</template>
