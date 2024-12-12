<script setup lang="ts">
import { GamePartials, mapGamePartialsToPartialsString } from '@/domain/game'

const props = defineProps({
  partials: {
    type: Object as PropType<GamePartials>,
    required: true,
  },
  size: {
    type: String,
    default: '1rem',
  },
})
</script>

<template>
  <div
    class="easy-game-statistics-partials-component"
    :style="{ fontSize: size }"
  >
    ({{ mapGamePartialsToPartialsString(partials) }})
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameStatisticsPartials',
}
</script>
