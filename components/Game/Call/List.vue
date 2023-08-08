<script setup lang="ts">
import { Player } from '@/domain/game'
import { Call } from '@/domain/call'

const props = defineProps({
  call: {
    type: Object as PropType<Call>,
    required: false,
  },
  players: {
    type: Array as PropType<Player[]>,
    required: true,
  },
  profileIds: {
    type: Array as PropType<number[]>,
    default: [],
  },
  captain: {
    type: Number as PropType<number | null>,
    required: true,
  },
  libero: {
    type: Number as PropType<number | null>,
    required: true,
  },
  togglePlayer: {
    type: Function as PropType<(id: number) => void>,
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
  <div
    class="easy-game-call-list-component grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 mt-2"
  >
    <GameCallItem
      v-for="(player, i) in players"
      :key="player.id"
      :player="player"
      :class="{
        'is-selected': profileIds?.includes(player.id),
        'is-captain': captain === player.id,
        'is-libero': libero === player.id,
      }"
      :tabindex="i + 1"
      @click="togglePlayer(player.id)"
      :updateCaptain="updateCaptain"
      :updateLibero="updateLibero"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameCallList',
}
</script>
