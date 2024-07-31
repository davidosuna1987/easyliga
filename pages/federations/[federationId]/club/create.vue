<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation'],
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-federations-club-create-page">
      <FederationClubCreate />
    </div>
  </NuxtLayout>
</template>
