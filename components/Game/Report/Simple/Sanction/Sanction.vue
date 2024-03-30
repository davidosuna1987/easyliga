<template>
  <article
    class="easy-game-report-sanction-component w-max place-content-center"
  >
    <div class="no-print">
      <div class="grid grid-cols-8">
        <GameReportSimpleSanctionHeader />
        <GameReportSimpleSanctionItem shirtNumber="E" />
        <GameReportSimpleSanctionItem shirtNumber="1" />
        <GameReportSimpleSanctionItem shirtNumber="99" />
      </div>
    </div>
    <div class="print">
      <div class="grid grid-cols-8">
        <GameReportSimpleSanctionPrintHeader />
        <GameReportSimpleSanctionPrintItem shirtNumber="E" />
        <GameReportSimpleSanctionPrintItem shirtNumber="1" />
        <GameReportSimpleSanctionPrintItem shirtNumber="99" />
      </div>
    </div>
  </article>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleSanction',
}
</script>
