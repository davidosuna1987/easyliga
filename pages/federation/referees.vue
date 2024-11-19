<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation'],
})

useEasyHead('pages.federation.referees.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-federation-referees-page">
      <FederationRefereeList />
    </div>
  </NuxtLayout>
</template>
