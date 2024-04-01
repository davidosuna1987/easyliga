<script lang="ts" setup>
const gameName = 'Navarvoley A VS Irbarate INF'
const print = () => {
  const originalTitle = document.title
  const titleSlug = gameName.toLowerCase().replace(/ /g, '-')
  document.title = `acta-${titleSlug}`
  window.print()
  document.title = originalTitle
}
</script>

<template>
  <div class="easy-game-report-component">
    <div class="report-wrapper max-w-[1220px] mx-auto">
      <GameReportSimpleHeader />

      <main
        class="report-main mt-3 grid grid-cols-1 md:[grid-template-columns:1fr_1fr_300px] gap-3"
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
  @page {
    size: A4 landscape;
    margin: 0;
  }

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
    font-size: 11px;
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

      .easy-game-report-component {
        .easy-icon-easy-liga-component {
          width: 50px;
          height: 50px;
        }
      }
    }
  }
}
</style>
