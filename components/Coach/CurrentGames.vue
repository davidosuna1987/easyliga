<script setup lang="ts">
import { Game } from '@/domain/game'
import { Call } from '@/domain/call'

const toast = useEasyToast()

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

const showGameLockedToast = () => {
  toast.warn(useNuxtApp().$i18n.t('calls.locked_warning'))
}
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
        <Button
          v-if="game.status === 'warmup'"
          class="action"
          outlined
          :label="$t('calls.call')"
          :severity="calls[index].locked ? 'warning' : 'primary'"
          @click.prevent="
            calls[index].locked
              ? showGameLockedToast()
              : navigateTo(
                  `/coach/games/${game.id}/teams/${calls[index].teamId}/call`,
                )
          "
        />
        <Button
          v-if="game.status === 'warmup'"
          class="action"
          outlined
          :label="$t('rotations.rotation')"
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
