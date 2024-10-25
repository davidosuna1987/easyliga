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
  hoverable: {
    type: Boolean,
    default: true,
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
    :class="[
      'easy-game-player-item easy-coach-rotation-player-component',
      { 'is-hoverable': hoverable },
    ]"
  >
    <div class="team-player-info">
      <IconShirtNumber :shirtNumber="player.shirtNumber" />
      {{ getFullName(player) }}
      <SanctionItem
        v-if="props.sanction"
        :severity="props.sanction.severity"
        size="1rem"
      />
    </div>
    <EasyGrid
      class="team-player-captain"
      :cols="countPlayerCaptainIcons(player)"
      :gap="2"
    >
      <IconLibero v-if="player.libero" />
      <IconCaptain v-if="player.captain" />
    </EasyGrid>
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
