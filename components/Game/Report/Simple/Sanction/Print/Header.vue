<script setup lang="ts">
import { GameReportTeamTypes } from '@/domain/game'
</script>

<template>
  <div class="col-span-8 p-2 grid place-content-center border-solid">
    <strong class="uppercase">{{ $t('sanctions.sanction', 2) }}</strong>
  </div>

  <div
    class="flex flex-col justify-center items-center border-solid border-t-0"
  >
    <p class="font-bold">{{ $t('reports.sanctions.short.warning') }}</p>
    <span class="font-2xs">{{ $t('reports.sanctions.warning') }}</span>
  </div>
  <div class="grid place-content-center border-solid border-t-0 border-x-0">
    <div class="flex flex-col justify-center items-center">
      <p class="font-bold">{{ $t('reports.sanctions.short.point') }}</p>
      <span class="font-2xs">{{ $t('reports.sanctions.point') }}</span>
    </div>
  </div>
  <div class="grid place-content-center border-solid border-t-0">
    <div class="flex flex-col justify-center items-center">
      <p class="font-bold">{{ $t('reports.sanctions.short.game') }}</p>
      <span class="font-2xs">{{ $t('reports.sanctions.set') }}</span>
    </div>
  </div>
  <div class="grid place-content-center border-solid border-t-0 border-x-0">
    <div class="flex flex-col justify-center items-center">
      <p class="font-bold">{{ $t('reports.sanctions.short.set') }}</p>
      <span class="font-2xs">{{ $t('reports.sanctions.game') }}</span>
    </div>
  </div>
  <div class="flex justify-center gap-1 p-2 border-solid border-t-0">
    <GameReportSimpleTeamIcon :type="GameReportTeamTypes.A" />
    <GameReportSimpleTeamIcon :type="GameReportTeamTypes.B" />
  </div>
  <div class="grid place-content-center border-solid border-x-0 border-t-0">
    <strong class="uppercase">{{ $t('sets.set') }}</strong>
  </div>
  <div class="grid place-content-center col-span-2 P-2 border-solid border-t-0">
    <strong class="uppercase">{{ $t('games.score') }}</strong>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleSanctionPrintHeader',
}
</script>
