<script setup lang="ts">
import { Player } from '@/domain/game'

const props = defineProps({
  player: {
    type: Object as PropType<Player>,
    required: true,
  },
})

const playerIconsCount = computed(() => {
  let count = 0
  if (props.player.libero) count++
  if (props.player.captain) count++
  return count
})
</script>

<template>
  <div class="easy-referee-game-call-item-component referee-arbitrate-sidebar">
    <div class="team-player-info">
      <IconShirtNumber :shirtNumber="player.shirtNumber" size="sm" />
      {{ player.firstName }} {{ player.lastName }}
    </div>
    <div
      v-if="playerIconsCount"
      class="team-player-icons grid gap-2"
      :class="[`grid-cols-${playerIconsCount}`]"
    >
      <IconLibero v-if="player.libero" size="sm" />
      <IconCaptain v-if="player.captain" size="sm" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameCallItem',
}
</script>
