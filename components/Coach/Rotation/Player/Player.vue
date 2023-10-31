<script setup lang="ts">
import { CallPlayerData } from '@/domain/call'
import { getFullName } from '@/domain/player'
import { Sanction } from '@/domain/sanction'

const props = defineProps({
  player: {
    type: Object as PropType<CallPlayerData>,
    required: true,
  },
  sanction: {
    type: Object as PropType<Sanction>,
    required: false,
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
  <div class="easy-game-player-item easy-coach-rotation-player-component">
    <div class="team-player-info">
      <IconShirtNumber :shirtNumber="player.shirtNumber" />
      {{ getFullName(player) }}
      <SanctionItem
        v-if="props.sanction"
        :severity="props.sanction.severity"
        size="1rem"
      />
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

<style scoped lang="scss">
.easy-game-player-item {
  &.easy-coach-rotation-player-component {
    .easy-sanction-item-component {
      position: static;
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'CoachRotationPlayer',
}
</script>
