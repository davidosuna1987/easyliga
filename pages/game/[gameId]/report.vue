<script lang="ts" setup>
definePageMeta({
  mainClass: 'game-report',
})

useEasyHead('pages.game.report.title')
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-game-report-page">
      <GameReportSimple />
    </div>
  </NuxtLayout>
</template>
