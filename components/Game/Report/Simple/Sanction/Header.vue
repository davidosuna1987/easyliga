<script setup lang="ts">
import { GameReportTeamTypes } from '@/domain/game'
</script>

<template>
  <div class="col-span-4 border-solid p-2 grid place-content-center">
    <strong class="uppercase">{{ $t('sanctions.sanction', 2) }}</strong>
  </div>
  <div class="flex justify-center items-center gap-1 border-solid border-x-0">
    <GameReportSimpleTeamIcon :type="GameReportTeamTypes.A" />
    <GameReportSimpleTeamIcon :type="GameReportTeamTypes.B" />
  </div>
  <div class="grid place-content-center border-solid">
    <strong class="uppercase">{{ $t('sets.set') }}</strong>
  </div>
  <div class="grid place-content-center col-span-2 P-2 border-solid border-l-0">
    <strong class="uppercase">{{ $t('games.score') }}</strong>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleSanctionHeader',
}
</script>
