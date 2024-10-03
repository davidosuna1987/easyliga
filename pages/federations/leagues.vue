<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation'],
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-leagues-page">
      <LeagueList />
    </div>
  </NuxtLayout>
</template>
