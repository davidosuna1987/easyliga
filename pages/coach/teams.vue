<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['coach'],
  reduced: true,
})

useEasyHead('pages.coach.teams.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-coach-team-list-page">
      <pre>{{ $route.meta }}</pre>
      <CoachTeamList />
    </div>
  </NuxtLayout>
</template>
