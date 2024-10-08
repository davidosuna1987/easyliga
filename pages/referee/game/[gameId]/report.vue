<script lang="ts" setup>
definePageMeta({
  // middleware: ['role'],
  // roles: ['federation', 'club', 'referee', 'trainee'],
  containerClass: 'game-report',
})

useEasyHead('pages.referee.game.report.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-referee-game-report-page">
      <GameReportSimple />
    </div>
  </NuxtLayout>
</template>
