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
    class="col-span-1 border-solid border-t-0 grid place-content-center h-[29.5px]"
  >
    <IconShirtNumber class="no-print" :shirtNumber="shirtNumber" size="sm" />
    <div class="print text-center w-8 font-bold">
      {{ shirtNumber }}
    </div>
  </div>
  <div
    class="col-span-5 px-1 border-solid border-t-0 border-x-0 flex items-center"
  >
    David Osuna Mondaca
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleCallPlayerItem',
}
</script>
