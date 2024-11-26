<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['referee_admin'],
})

useEasyHead('pages.referee.admin.referees')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-referee-admin-referees-page">
      <FederationRefereeList isRefereeAdmin />
    </div>
  </NuxtLayout>
</template>
