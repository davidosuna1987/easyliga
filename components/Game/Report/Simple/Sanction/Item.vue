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
  <div
    class="col-span-4 p-2 flex gap-2 items-center border-solid border-t-0 border-r-0"
  >
    <div class="grid place-content-center w-8">
      <SanctionItem :severity="'game'" size="1rem" />
    </div>
    <IconShirtNumber class="no-print" :shirtNumber="shirtNumber" size="sm" />
    <div class="print text-center w-8 font-bold">
      {{ shirtNumber }}
    </div>
    David Osuna Mondaca
  </div>
  <div
    class="grid place-content-center gap-1 p-2 border-solid border-t-0 border-x-0"
  >
    <GameReportSimpleTeamIcon :type="GameReportTeamTypes.A" />
  </div>
  <div class="grid place-content-center border-solid border-t-0 border-x-0">
    1
  </div>
  <div
    class="grid grid-cols-[1fr_auto_1fr] gap-1.5 place-content-center col-span-2 p-2 border-solid border-t-0 border-l-0"
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
