<script setup lang="ts">
import { CallPlayerData } from '@/domain/call'

const props = defineProps({
  player: {
    type: Object as PropType<CallPlayerData>,
    required: true,
  },
})

const countPlayerCaptainIcons = (player: CallPlayerData) => {
  let count = 0
  if (player.libero) count++
  if (player.captain) count++
  return count
}
</script>

<template>
  <div
    class="easy-game-call-item-component easy-coach-rotation-player-component"
  >
    <div class="team-player-info">
      <IconShirtNumber :shirtNumber="player.shirtNumber" />
      {{ player.firstName }} {{ player.lastName }}
    </div>
    <div
      class="team-player-captain grid gap-2"
      :class="[`grid-cols-${countPlayerCaptainIcons(player)}`]"
    >
      <IconLibero v-if="player.libero" />
      <IconCaptain v-if="player.captain" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CoachRotationPlayer',
}
</script>
