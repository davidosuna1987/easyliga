<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['club'],
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-club-teams-page">Club Teams List</div>
  </NuxtLayout>
</template>
