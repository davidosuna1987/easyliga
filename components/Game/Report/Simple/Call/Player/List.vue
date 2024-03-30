<script setup lang="ts">
defineProps({
  testMax: {
    type: Number,
    required: true,
  },
  testLength: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="easy-game-report-call-player-list-component grid grid-cols-6">
    <!-- <GameReportSimpleCallPlayerHeader /> -->
    <template v-for="i in testMax">
      <GameReportSimpleCallPlayerItem v-if="i <= testLength" :shirtNumber="i" />
      <template v-else>
        <div class="col-span-1 border-solid border-t-0 h-[29.5px]" />
        <div class="col-span-5 border-solid border-t-0 border-x-0 h-[29.5px]" />
      </template>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleCallPlayerList',
}
</script>
