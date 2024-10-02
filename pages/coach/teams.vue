<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['coach'],
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-coach-team-list-page">
      <CoachTeamList />
    </div>
  </NuxtLayout>
</template>
