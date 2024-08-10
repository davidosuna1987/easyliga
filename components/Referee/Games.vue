<script setup lang="ts">
import { Game, isMatchDay } from '@/domain/game'

const props = defineProps({
  games: {
    type: Array as PropType<Game[]>,
    required: true,
  },
})

const { t } = useI18n()

const handleGameClick = (game: Game) => {
  if (isMatchDay(game)) {
    navigateTo(`/referee/games/${game.id}/arbitrate`)
  }

  return
}
</script>

<template>
  <div class="easy-referee-games-component">
    <div
      v-for="game in games"
      :key="game.id"
      v-tooltip.top="{
        value: t('games.arbitrate'),
        disabled: !isMatchDay(game),
      }"
      :class="['game', { 'is-disabled': !isMatchDay(game) }]"
      @click="handleGameClick(game)"
    >
      <span class="name">{{ game.name }}</span>
      <GameStatus :status="game.status" :start="game.date" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGames',
}
</script>
