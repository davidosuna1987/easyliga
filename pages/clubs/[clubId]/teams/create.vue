<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['club'],
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-club-team-create-page">
      <TeamCreate />
    </div>
  </NuxtLayout>
</template>
