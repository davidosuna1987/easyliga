<script setup lang="ts">
import { CallPlayerData } from '@/domain/call'

defineProps({
  rowLength: {
    type: Number,
    required: true,
  },
  players: {
    type: Array as PropType<CallPlayerData[]>,
    required: true,
  },
})
</script>

<template>
  <div class="easy-game-report-call-player-list-component grid grid-cols-6">
    <template v-for="i in rowLength">
      <GameReportSimpleCallPlayerItem :player="players[i - 1]" />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleCallPlayerList',
}
</script>
