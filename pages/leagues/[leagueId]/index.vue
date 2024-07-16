<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation'],
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-league-show-page">
      <LeagueShow />
    </div>
  </NuxtLayout>
</template>
