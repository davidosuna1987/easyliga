<script setup lang="ts">
import { Game } from '@/domain/game'
import { Call } from '@/domain/call'

const props = defineProps({
  games: {
    type: Array as PropType<Game[]>,
    required: true,
  },
  calls: {
    type: Array as PropType<Call[]>,
    required: true,
  },
})

const callUnlocked = (callIndex: number) =>
  !props.calls[callIndex]?.locked ||
  props.calls[callIndex]?.playersData.length < 6

const rotationLocked = (callIndex: number) =>
  props.calls[callIndex]?.currentRotation?.locked
</script>

<template>
  <div class="easy-coach-current-games-component">
    <div v-for="(game, index) in games" class="game">
      <span class="name">{{ game.name }}</span>
      <GameStatus :status="game.status" />
      <div
        class="actions grid gap-2 mt-3"
        :class="[game.status === 'warmup' ? 'grid-cols-3' : 'grid-cols-1']"
      >
        <CoachButtonCall
          v-if="game.status === 'warmup'"
          class="action"
          :gameId="game.id"
          :teamId="calls[index]?.teamId"
          :locked="!!calls[index]?.locked"
        />
        <CoachButtonRotation
          v-if="game.status === 'warmup'"
          class="action"
          :gameId="game.id"
          :callId="calls[index]?.id"
          :callUnlocked="!!callUnlocked(index)"
          :locked="!!rotationLocked(index)"
        />
        <!-- <CoachButtonPlayerChange
          v-if="game.status === 'playing'"
          class="action"
          :gameId="game.id"
          :callId="calls[index]?.id"
          :callUnlocked="!!callUnlocked(index)"
          :locked="!!rotationLocked(index)"
        /> -->
        <Button class="action" outlined :label="$t('games.game')" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CoachCurrentGames',
}
</script>
