<script setup lang="ts">
import { Game } from '@/domain/game'
import { formatDateTime } from '@/domain/utils'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    required: true,
  },
})
</script>

<template>
  <div class="easy-league-game-card-component">
    <p>{{ game.name }}</p>
    <small class="opacity-60">
      {{ formatDateTime(game.date) }}
    </small>
  </div>
</template>

<style scoped lang="scss">
.easy-league-game-card-component {
  border: solid 1px var(--input-border-color);
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;

  &:hover {
    background-color: var(--primary-color-medium);
    border-color: var(--primary-color);
  }
}
</style>

<script lang="ts">
export default {
  name: 'LeagueGameCard',
}
</script>
