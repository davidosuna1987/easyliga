<script setup lang="ts">
import { Player } from '@/domain/player'

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
  setCaptainToggleDisabledProfileId: {
    type: Number,
    required: false,
  },
  tooltipsDisabled: {
    type: Boolean,
    default: false,
  },
})

const isSelected = (player: Player) =>
  props.selectedPlayers?.some(p => p.profileId === player.profileId)

const getPlayer = (player: Player) => {
  const selectedPlayer = props.selectedPlayers?.find(
    p => p.profileId === player.profileId,
  )
  return selectedPlayer ?? player
}
</script>

<template>
  <div
    class="easy-game-call-list-component grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 mt-2"
  >
    <PlayerItem
      v-for="(player, i) in players"
      :key="player.profileId"
      :player="getPlayer(player)"
      selectable
      :selected="isSelected(player)"
      @click="togglePlayer(player)"
      :setCaptain="setCaptain"
      :setLibero="setLibero"
      :setShirtNumberUpdatePlayer="setShirtNumberUpdatePlayer"
      :setCaptainToggleDisabledProfileId="setCaptainToggleDisabledProfileId"
      :tooltipsDisabled="tooltipsDisabled"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameCallList',
}
</script>
