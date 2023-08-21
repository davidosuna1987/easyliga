<script setup lang="ts">
import { Player } from '@/domain/game'

const props = defineProps({
  players: {
    type: Array as PropType<Player[]>,
    required: true,
  },
  selectedPlayers: {
    type: Array as PropType<Player[]>,
    default: [],
  },
  togglePlayer: {
    type: Function as PropType<(player: Player) => void>,
    required: true,
  },
  setCaptain: {
    type: Function as PropType<(id: number) => void>,
    required: true,
  },
  setLibero: {
    type: Function as PropType<(id: number) => void>,
    required: true,
  },
  setShirtNumberUpdatePlayer: {
    type: Function as PropType<(player: Player) => void>,
    required: true,
  },
})

const isSelected = (player: Player) =>
  props.selectedPlayers?.some(p => p.profileId === player.profileId)

const getPlayer = (player: Player) => {
  const selectedPlayer = props.selectedPlayers?.find(
    p => p.profileId === player.profileId,
  )

  if (selectedPlayer) {
    return selectedPlayer
  }

  return player
}
</script>

<template>
  <div
    class="easy-game-call-list-component grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 mt-2"
  >
    <GameCallItem
      v-for="(player, i) in players"
      :key="player.profileId"
      :player="getPlayer(player)"
      :class="{
        'is-selected': isSelected(player),
        'is-captain': selectedPlayers.find(
          p => p.profileId === player.profileId,
        )?.captain,
        'is-libero': selectedPlayers.find(p => p.profileId === player.profileId)
          ?.libero,
      }"
      :selected="isSelected(player)"
      @click="togglePlayer(player)"
      :setCaptain="setCaptain"
      :setLibero="setLibero"
      :setShirtNumberUpdatePlayer="setShirtNumberUpdatePlayer"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameCallList',
}
</script>
