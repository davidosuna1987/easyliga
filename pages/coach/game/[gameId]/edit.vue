<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['coach'],
})

useEasyHead('pages.coach.game.edit.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-coach-games-edit-page">
      <CoachGameEdit />
    </div>
  </NuxtLayout>
</template>
