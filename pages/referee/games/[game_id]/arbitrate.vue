<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['admin', 'referee'],
  containerClass: 'referee-arbitrate',
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-referee-game-arbitrate-page">
      <RefereeGameArbitrate />
    </div>
  </NuxtLayout>
</template>
