<script setup lang="ts">
import { GameStatistics } from '@/domain/game'

const props = defineProps({
  statistics: {
    type: Object as PropType<GameStatistics>,
    required: true,
  },
  highlight: {
    type: Boolean,
    default: true,
  },
  prefix: {
    type: String,
    required: false,
  },
  hideResult: {
    type: Boolean,
    default: false,
  },
})

const size = '0.8rem'
</script>

<template>
  <div class="easy-game-statistics-line-component flex gap-1">
    <span v-if="prefix" class="prefix">{{ prefix }}</span>
    <GameStatisticsResult
      v-if="!hideResult"
      :statistics="statistics"
      :highlight="highlight"
      :size="size"
    />
    <GameStatisticsPartials :partials="statistics.partials" :size="size" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameStatisticsLine',
}
</script>
