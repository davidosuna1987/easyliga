<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['coach'],
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-coach-games-edit-page">
      <CoachGameEdit />
    </div>
  </NuxtLayout>
</template>
