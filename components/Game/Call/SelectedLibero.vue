<script setup lang="ts">
import { Player, getFullName } from '@/domain/player'
import { CallPlayerData } from '@/domain/call'

const props = defineProps({
  player: {
    type: Object as PropType<Player | CallPlayerData>,
    required: false,
  },
})
</script>

<template>
  <div
    class="easy-game-call-selected-libero-component"
    :class="{ 'text-gray-300': !player }"
  >
    <IconLibero />
    <IconShirtNumber v-if="player" :shirtNumber="player.shirtNumber" />
    {{ player ? getFullName(player) : $t('teams.libero_select') }}
  </div>
</template>

<style scoped lang="scss">
.easy-game-call-selected-libero-component {
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 0.5rem;

  .easy-icon-libero-component {
    pointer-events: none;
    user-select: none;
  }
}
</style>

<script lang="ts">
export default {
  name: 'GameCallSelectedLibero',
}
</script>
