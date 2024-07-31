<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation'],
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-federations-clubs-page">
      <FederationClubList />
    </div>
  </NuxtLayout>
</template>
