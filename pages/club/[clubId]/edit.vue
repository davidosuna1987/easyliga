<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation', 'club'],
})

useEasyHead('pages.club.edit.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-club-edit-page">
      <ClubEdit />
    </div>
  </NuxtLayout>
</template>
