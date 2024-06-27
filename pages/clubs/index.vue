<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['club'],
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-clubs-page">
      <ClubList />
    </div>
  </NuxtLayout>
</template>
