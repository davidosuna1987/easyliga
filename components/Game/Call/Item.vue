<script setup lang="ts">
import { Player } from '@/domain/game'

const props = defineProps({
  player: {
    type: Object as PropType<Player>,
    required: true,
  },
  updateCaptain: {
    type: Function as PropType<(id: number) => void>,
    required: true,
  },
  updateLibero: {
    type: Function as PropType<(id: number) => void>,
    required: true,
  },
})
</script>

<template>
  <div class="easy-game-call-item-component">
    <div class="team-player-info">
      <Avatar class="player-avatar" :image="player.avatar" shape="circle" />
      <IconShirtNumber :shirtNumber="player.shirtNumber" />
      {{ player.firstName }} {{ player.lastName }}
    </div>
    <div class="team-player-captain grid gap-2 grid-cols-2">
      <IconLibero
        v-tooltip.top="$t('teams.libero_assign')"
        @click.stop="updateLibero(player.id)"
      />
      <IconCaptain
        v-tooltip.top="$t('teams.captain_assign')"
        @click.stop="updateCaptain(player.id)"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameCallItem',
}
</script>
