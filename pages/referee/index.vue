<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['referee'],
})

useEasyHead('pages.referee.index.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-referee-page">
      <RefereePanel />
    </div>
  </NuxtLayout>
</template>
