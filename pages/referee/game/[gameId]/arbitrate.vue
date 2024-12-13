<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['admin', 'referee'],
  mainClass: 'referee-arbitrate',
})

useEasyHead('pages.referee.game.arbitrate.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-referee-game-arbitrate-page">
      <RefereeGameArbitrate />
    </div>
  </NuxtLayout>
</template>
