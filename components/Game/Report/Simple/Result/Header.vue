<script setup lang="ts">
import { GameReportTeamTypes } from '@/domain/game'
</script>

<template>
  <header class="col-span-10 border-solid p-2 grid place-content-center">
    <strong class="uppercase">Resultado final</strong>
  </header>

  <div
    class="flex justify-between col-span-5 border-solid border-r-0 border-t-0 p-2"
  >
    <span>Navarvoley A</span>
    <GameReportSimpleTeamIcon :type="GameReportTeamTypes.B" />
  </div>

  <div
    class="flex flex-row-reverse justify-between col-span-5 border-solid border-t-0 p-2"
  >
    <span>Irbarate INF</span>
    <GameReportSimpleTeamIcon :type="GameReportTeamTypes.A" />
  </div>

  <div class="grid place-content-center p-2 border-solid border-r-0 border-t-0">
    <strong>"T"</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-t-0">
    <strong>S</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-x-0 border-t-0">
    <strong>W</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-t-0">
    <strong>P</strong>
  </div>

  <div
    class="grid grid-cols-2 place-content-center col-span-2 p-2 border-solid border-x-0 text-center border-t-0"
  >
    <strong class="uppercase">Set</strong>
    <span class="font-2xs place-self-center">(duración)</span>
  </div>

  <div class="grid place-content-center p-2 border-solid border-t-0">
    <strong>P</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-x-0 border-t-0">
    <strong>W</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-t-0">
    <strong>S</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-l-0 border-t-0">
    <strong>"T"</strong>
  </div>

  <div class="col-span-10 border-solid border-b-0"></div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleResultHeader',
}
</script>
