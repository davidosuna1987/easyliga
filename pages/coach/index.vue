<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['coach'],
})

useEasyHead('pages.coach.index.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-coach-page">
      <CoachPanel />
    </div>
  </NuxtLayout>
</template>
