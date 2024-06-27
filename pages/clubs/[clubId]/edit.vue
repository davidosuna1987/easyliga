<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['club'],
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-club-edit-page">
      <ClubEdit />
    </div>
  </NuxtLayout>
</template>
