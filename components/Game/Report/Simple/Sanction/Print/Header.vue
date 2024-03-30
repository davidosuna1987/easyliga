<script setup lang="ts">
import { GameReportTeamTypes } from '@/domain/game'
</script>

<template>
  <div class="col-span-8 p-2 grid place-content-center border-solid">
    <strong>SANCIONES</strong>
  </div>

  <div
    class="flex flex-col justify-center items-center border-solid border-t-0"
  >
    <p class="font-bold">W</p>
    <span class="font-2xs">Amonestación</span>
  </div>
  <div class="grid place-content-center border-solid border-t-0 border-x-0">
    <div class="flex flex-col justify-center items-center">
      <p class="font-bold">P</p>
      <span class="font-2xs">Castigo</span>
    </div>
  </div>
  <div class="grid place-content-center border-solid border-t-0">
    <div class="flex flex-col justify-center items-center">
      <p class="font-bold">E</p>
      <span class="font-2xs">Expulsión</span>
    </div>
  </div>
  <div class="grid place-content-center border-solid border-t-0 border-x-0">
    <div class="flex flex-col justify-center items-center">
      <p class="font-bold">D</p>
      <span class="font-2xs">Descanso</span>
    </div>
  </div>
  <div class="flex justify-center gap-1 p-2 border-solid border-t-0">
    <GameReportSimpleTeamIcon :type="GameReportTeamTypes.A" />
    <GameReportSimpleTeamIcon :type="GameReportTeamTypes.B" />
  </div>
  <div class="grid place-content-center border-solid border-x-0 border-t-0">
    <strong>SET</strong>
  </div>
  <div class="grid place-content-center col-span-2 P-2 border-solid border-t-0">
    <strong>MARCADOR</strong>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleSanctionPrintHeader',
}
</script>
