<template>
  <aside class="easy-game-report-call-component">
    <div class="grid grid-cols-12">
      <GameReportSimpleCallHeader />
      <div class="col-span-6 border-solid border-b-0 border-x-0">
        <GameReportSimpleCallPlayerList :testMax="9" :testLength="6" />
      </div>
      <div class="col-span-6 border-solid border-b-0 border-l-0">
        <GameReportSimpleCallPlayerList :testMax="9" :testLength="9" />
      </div>
      <GameReportSimpleCallLiberoHeader />
      <div class="col-span-6 border-solid border-b-0 border-x-0">
        <GameReportSimpleCallPlayerList :testMax="2" :testLength="2" />
      </div>
      <div class="col-span-6 border-solid border-b-0 border-l-0">
        <GameReportSimpleCallPlayerList :testMax="2" :testLength="1" />
      </div>
      <GameReportSimpleCallStaffHeader />
      <div class="col-span-12 border-solid">
        <div class="grid grid-cols-11 place-content-center">
          <div class="col-span-5 px-2 flex items-center">
            Javier Melguizo Molina
          </div>
          <div
            class="col-span-1 border-solid border-y-0 h-[29.5px] grid place-content-center"
          >
            <IconShirtNumber class="no-print" shirtNumber="E" size="sm" />
            <strong class="print">E</strong>
          </div>
          <div class="col-span-5 px-2 flex items-center">
            El loco de la colina
          </div>
        </div>
      </div>
      <GameReportSimpleCallFooter />
    </div>
  </aside>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleCall',
}
</script>
