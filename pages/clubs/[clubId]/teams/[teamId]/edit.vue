<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['club', 'coach'],
})

useEasyHead('pages.club.team.edit.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-club-team-edit-page">
      <TeamEdit />
    </div>
  </NuxtLayout>
</template>
