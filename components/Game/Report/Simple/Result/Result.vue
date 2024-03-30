<template>
  <aside class="easy-game-report-result-component">
    <div class="grid grid-cols-10">
      <GameReportSimpleResultHeader />
      <GameReportSimpleResultItem />
      <GameReportSimpleResultItem />
      <GameReportSimpleResultItem />
      <GameReportSimpleResultItem />
      <GameReportSimpleResultItem />
      <GameReportSimpleResultFooter />
    </div>
  </aside>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleResult',
}
</script>
