<script lang="ts" setup>
const print = () => {
  window.print()
}
</script>

<template>
  <div class="easy-game-report-component">
    <div class="report-wrapper max-w-[1220px] mx-auto">
      <GameReportSimpleHeader />

      <main
        class="report-main mt-3 grid grid-cols-1 md:grid-cols-2 lg:[grid-template-columns:1fr_1fr_300px] gap-3"
      >
        <GameReportSimpleCall />
        <div class="grid gap-3">
          <GameReportSimpleResult />
          <GameReportSimpleSanction />
        </div>
        <div class="flex flex-col gap-3">
          <GameReportSimpleObservations />
          <GameReportSimpleSignatures />
        </div>
      </main>
    </div>

    <Button
      class="easy-game-report-print-button float-right mt-3 no-print"
      @click="print"
      size="small"
      variant="primary"
    >
      Imprimir
    </Button>
  </div>
</template>

<style lang="scss">
.print {
  display: none;
}

.easy-container {
  height: min-content !important;
}

@media print {
  .no-print {
    display: none !important;
  }

  .print {
    display: block !important;
  }

  html {
    margin: 0;
    padding: 0;
    min-height: 0;
  }

  body {
    margin: 0;
    padding: 0;
    min-height: 0;
  }

  .easy-navbar,
  .easy-footer {
    display: none;
  }

  .easy-main {
    min-height: 0;
    margin-block: 0;
    border-radius: 0;

    .easy-container {
      border-radius: 0;
      box-shadow: none;
      padding: 2.5rem;
    }
  }
}
</style>
