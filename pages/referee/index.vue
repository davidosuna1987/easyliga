<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['referee'],
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-referee-page">
      <RefereePanel />
    </div>
  </NuxtLayout>
</template>
