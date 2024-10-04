<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['club'],
})

useEasyHead('pages.club.index.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-clubs-page">
      <ClubTeams />
    </div>
  </NuxtLayout>
</template>
