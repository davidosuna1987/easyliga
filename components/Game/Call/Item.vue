<script setup lang="ts">
import { Player } from '@/domain/game'

const props = defineProps({
  player: {
    type: Object as PropType<Player>,
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
  selected: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="easy-game-call-item-component">
    <div class="team-player-info">
      <Avatar
        class="player-avatar"
        :image="player?.avatar ?? undefined"
        shape="circle"
      />
      <IconShirtNumber
        v-tooltip.top="{
          value: $t('shirts.number_change'),
          disabled: !selected,
        }"
        :shirtNumber="player.shirtNumber"
        @click.stop="setShirtNumberUpdatePlayer(player)"
      />
      {{ player.firstName }} {{ player.lastName }}
    </div>
    <div class="team-player-captain grid gap-2 grid-cols-2">
      <IconLibero
        v-tooltip.top="$t('teams.libero_assign')"
        @click.stop="setLibero(player.profileId)"
      />
      <IconCaptain
        v-tooltip.top="$t('teams.captain_assign')"
        @click.stop="setCaptain(player.profileId)"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameCallItem',
}
</script>
