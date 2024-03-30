<script setup lang="ts">
import { GameReportTeamTypes } from '@/domain/game'

const props = defineProps({
  shirtNumber: {
    type: [Number, String],
    required: true,
  },
})
</script>

<template>
  <div class="grid place-content-center p-2 border-solid border-t-0">
    <IconShirtNumber class="no-print" :shirtNumber="shirtNumber" size="sm" />
    <div class="print text-center w-8 font-bold">
      {{ shirtNumber }}
    </div>
  </div>
  <div
    class="grid place-content-center p-2 border-solid border-t-0 border-x-0"
  ></div>
  <div class="grid place-content-center p-2 border-solid border-t-0"></div>
  <div
    class="grid place-content-center p-2 border-solid border-t-0 border-x-0"
  ></div>
  <div class="grid place-content-center gap-1 p-2 border-solid border-t-0">
    <GameReportSimpleTeamIcon class="no-print" :type="GameReportTeamTypes.A" />
    <div class="print text-center font-bold">
      {{ GameReportTeamTypes.A }}
    </div>
  </div>
  <div class="grid place-content-center border-solid border-x-0 border-t-0">
    1
  </div>
  <div
    class="grid grid-cols-[1fr_auto_1fr] gap-1.5 place-content-center col-span-2 P-2 border-solid border-t-0"
  >
    <span class="justify-self-end">9</span>
    <span>:</span>
    <span>10</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleSanctionItem',
}
</script>
