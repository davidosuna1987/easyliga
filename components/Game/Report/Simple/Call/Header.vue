<script lang="ts" setup>
import { GameReportTeamTypes } from '@/domain/game'
</script>

<template>
  <div class="col-span-12 text-center p-2 border-solid">
    <strong class="uppercase">Convocatoria</strong>
  </div>
  <div class="col-span-1 p-2 border-solid border-t-0 border-r-0">
    <GameReportSimpleTeamIcon :type="GameReportTeamTypes.B" />
  </div>
  <div class="col-span-5 p-2 border-solid border-t-0 border-x-0">
    Navarvoley A
  </div>
  <div class="col-span-5 p-2 border-solid border-t-0 border-r-0 text-right">
    Irbarate INF
  </div>
  <div class="col-span-1 p-2 border-solid border-t-0 border-l-0">
    <GameReportSimpleTeamIcon :type="GameReportTeamTypes.A" />
  </div>
  <div class="col-span-1 p-2 border-solid border-t-0"><strong>Nº</strong></div>
  <div class="col-span-5 p-2 border-solid border-t-0 border-x-0">
    <strong>Nombre del jugador</strong>
  </div>
  <div class="col-span-1 p-2 border-solid border-t-0"><strong>Nº</strong></div>
  <div class="col-span-5 p-2 border-solid border-t-0 border-l-0">
    <strong>Nombre del jugador</strong>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleCallHeader',
}
</script>
