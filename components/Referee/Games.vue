<script setup lang="ts">
import { Game } from '@/domain/game'
import moment from 'moment'

const props = defineProps({
  games: {
    type: Array as PropType<Game[]>,
    required: true,
  },
})

const { t } = useI18n()

const isDayGame = (game: Game) => {
  return game.date && moment(game.date).isSame(moment(), 'day')
}

const handleGameClick = (game: Game) => {
  if (isDayGame(game)) {
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
        disabled: !isDayGame(game),
      }"
      :class="['game', { 'is-disabled': !isDayGame(game) }]"
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
