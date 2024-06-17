<script setup lang="ts">
import { Player } from '@/domain/player'

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
  selectable: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
</script>

<template>
  <div class="easy-game-player-item">
    <div class="team-player-info">
      <Avatar class="player-avatar" :image="player?.avatar" shape="circle" />
      <IconShirtNumber
        v-tooltip.top="{
          value: t('shirts.number_change'),
          disabled: !selectable && !selected,
        }"
        :shirtNumber="player.shirtNumber"
        @click.stop="setShirtNumberUpdatePlayer(player)"
      />
      {{ player.firstName }} {{ player.lastName }}
    </div>
    <EasyGrid class="team-player-captain" :cols="2" :gap="2">
      <IconLibero
        v-tooltip.top="t('teams.libero_assign')"
        @click.stop="setLibero(player.profileId)"
      />
      <IconCaptain
        v-tooltip.top="t('teams.captain_assign')"
        @click.stop="setCaptain(player.profileId)"
      />
    </EasyGrid>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameCallItem',
}
</script>
