<script setup lang="ts">
import { Game } from '@/domain/game'
import { Call, MIN_CALL_PLAYERS } from '@/domain/call'
import { Rotation, MAX_ROTATION_PLAYER_CHANGES } from '@/domain/rotation'

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

const currentSetRotation = (
  game: Game,
  callId: number,
): Rotation | undefined => {
  return game.currentSet?.rotations?.find(
    rotation => rotation.callId === callId,
  )
}

const callUnlocked = (callIndex: number): boolean | undefined =>
  !props.calls[callIndex]?.locked ||
  props.calls[callIndex]?.playersData.length < MIN_CALL_PLAYERS

const maxSetPlayerChangesReached = (
  game: Game,
  callId: number,
): boolean | undefined => {
  const rotation = currentSetRotation(game, callId)

  if (!rotation) return

  return rotation.playerChangesCount >= MAX_ROTATION_PLAYER_CHANGES
}
</script>

<template>
  <div class="easy-coach-current-games-component">
    <div v-for="(game, index) in games" class="game">
      <span class="name">{{ game.name }}</span>
      <GameStatus :status="game.status" />
      <div
        class="actions grid gap-2 mt-3"
        :class="[game.status === 'warmup' ? 'grid-cols-3' : 'grid-cols-2']"
      >
        <CoachButtonCall
          v-if="game.status === 'warmup'"
          class="action"
          :gameId="game.id"
          :teamId="calls[index]?.teamId"
          :locked="!!calls[index]?.locked"
        />
        <CoachButtonRotation
          v-if="['warmup', 'resting'].includes(game.status)"
          class="action"
          :gameId="game.id"
          :callId="calls[index]?.id"
          :callUnlocked="!!callUnlocked(index)"
          :locked="!!currentSetRotation(game, calls[index]?.id)?.locked"
        />
        <CoachButtonPlayerChange
          v-if="game.status === 'playing'"
          class="action"
          :gameId="game.id"
          :teamId="calls[index]?.teamId"
          :rotation="currentSetRotation(game, calls[index]?.id)"
          :locked="!!maxSetPlayerChangesReached(game, calls[index]?.id)"
        />
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
