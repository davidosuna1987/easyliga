<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation'],
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-federations-league-create-page">
      <FederationLeagueCreate />
    </div>
  </NuxtLayout>
</template>
