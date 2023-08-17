<script setup lang="ts">
import { Game } from '@/domain/game'

const props = defineProps({
  games: {
    type: Array as PropType<Game[]>,
    required: true,
  },
})
</script>

<template>
  <div class="easy-referee-current-games-component">
    <div
      v-for="game in games"
      v-tooltip.top="$t('games.arbitrate')"
      class="game"
      @click="navigateTo(`/referee/games/arbitrate/${game.id}`)"
    >
      <span class="name">{{ game.name }}</span>
      <GameStatus :status="game.status" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeCurrentGames',
}
</script>
