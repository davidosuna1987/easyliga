<script setup lang="ts">
import {
  GameStatistics,
  mapGamePartialsToPartialsString,
  mapGameStatisticsToTeamTextColors,
} from '@/domain/game'

const props = defineProps({
  statistics: {
    type: Object as PropType<GameStatistics>,
    required: true,
  },
  size: {
    type: String,
    default: '1rem',
  },
  highlight: {
    type: Boolean,
    default: true,
  },
  prefix: {
    type: String,
    required: false,
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
    class="easy-game-statistics-line-component flex gap-1"
    :style="{ fontSize: size }"
  >
    <span v-if="prefix" class="prefix">{{ prefix }}</span>

    <div class="sets">
      <strong v-if="highlight" :class="[localTeamColor]">
        {{ statistics.localTeamSetsWon }}
      </strong>
      <span v-else>{{ statistics.localTeamSetsWon }}</span>
      <span>:</span>
      <span :class="[visitorTeamColor]">
        {{ statistics.visitorTeamSetsWon }}
      </span>
    </div>

    <div class="partials">
      ({{ mapGamePartialsToPartialsString(statistics.partials) }})
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameStatisticsLine',
}
</script>
