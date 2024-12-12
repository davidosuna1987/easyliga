<script setup lang="ts">
import {
  GameStatistics,
  mapGameStatisticsToTeamTextColors,
} from '@/domain/game'

const props = defineProps({
  statistics: {
    type: Object as PropType<GameStatistics>,
    required: true,
  },
  highlight: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: '1rem',
  },
  monospace: {
    type: Boolean,
    default: true,
  },
})
const teamTextColors = mapGameStatisticsToTeamTextColors(
  props.statistics,
  props.highlight,
)
const localTeamColor = teamTextColors.local
const visitorTeamColor = teamTextColors.visitor
</script>

<template>
  <div
    :class="[
      'easy-game-statistics-result-component',
      { 'font-mono': monospace },
    ]"
    :style="{ fontSize: size }"
  >
    <span v-if="highlight" :class="[localTeamColor]">
      {{ statistics.localTeamSetsWon }}
    </span>
    <span v-else>{{ statistics.localTeamSetsWon }}</span>
    <span>:</span>
    <span :class="[visitorTeamColor]">
      {{ statistics.visitorTeamSetsWon }}
    </span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameStatisticsResult',
}
</script>
