<script setup lang="ts">
import { Game, isMatchDay, isMatchDayPassed } from '@/domain/game'

const props = defineProps({
  games: {
    type: Array as PropType<Game[]>,
    required: true,
  },
})

const { t } = useI18n()

const handleGameClick = (game: Game) => {
  if (isMatchDay(game)) {
    navigateTo(`/referee/game/${game.id}/arbitrate`)
  }

  if (showActa(game)) {
    navigateTo(`/game/${game.id}/report`)
  }

  return
}

const showActa = (game: Game) => {
  return isMatchDayPassed(game) || game.status === 'finished'
}

const gameSigned = (game: Game) => {
  return game.status === 'finished' && game.signatures?.length === 5
}
</script>

<template>
  <div class="easy-referee-games-component">
    <div
      v-for="game in games"
      :key="game.id"
      v-tooltip.top="{
        value: showActa(game) ? t('reports.show_game') : t('games.arbitrate'),
        disabled: !isMatchDay(game) && !showActa(game),
      }"
      :class="['game', { 'is-finished': game.status === 'finished' }]"
      @click="handleGameClick(game)"
    >
      <span class="name">{{ game.name }}</span>
      <GameStatus :status="game.status" :start="game.date" />
      <Button
        v-if="gameSigned(game)"
        class="mt-3"
        :label="t('reports.show_game')"
        size="small"
        @click.prevent="navigateTo(`/game/${game.id}/report`)"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGames',
}
</script>
