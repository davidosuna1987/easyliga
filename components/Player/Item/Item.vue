<script setup lang="ts">
import { Player, getFullName } from '@/domain/player'
import { CallPlayerData } from '@/domain/call'

const props = defineProps({
  player: {
    type: Object as PropType<Player | CallPlayerData>,
    required: true,
  },
  setCaptain: {
    type: Function as PropType<(id: number) => void>,
    default: null,
  },
  setLibero: {
    type: Function as PropType<(id: number) => void>,
    default: null,
  },
  removePlayer: {
    type: Function as PropType<(id: number) => void>,
    default: null,
  },
  setShirtNumberUpdatePlayer: {
    type: Function as PropType<(player: Player) => void>,
    default: null,
  },
  setCaptainToggleDisabledProfileId: {
    type: Number,
    required: false,
  },
  tooltipsDisabled: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  showIcons: {
    type: Boolean,
    default: true,
  },
  showCaptain: {
    type: Boolean,
    default: true,
  },
  showLibero: {
    type: Boolean,
    default: true,
  },
})

const tooltipDisabled = computed(
  () => !!props.tooltipsDisabled || (props.selectable && !props.selected),
)

const iconsGap = computed(() => {
  let gap = 0
  if (!!props.removePlayer) gap++
  if (!!props.showCaptain) gap++
  if (!!props.showLibero) gap++
  return gap
})
</script>

<template>
  <div
    class="easy-game-player-item"
    :class="{
      'is-selectable': selectable,
      'is-selected': selected,
      'is-captain': showCaptain,
      'is-libero': showLibero,
    }"
  >
    <div class="team-player-info">
      <Avatar
        class="player-avatar"
        :image="player?.avatar ?? undefined"
        shape="circle"
      />
      <IconShirtNumber
        v-tooltip.top="{
          value: $t('shirts.number_change'),
          disabled: tooltipDisabled,
        }"
        :shirtNumber="player.shirtNumber"
        @click.stop="setShirtNumberUpdatePlayer(player)"
      />
      <span class="player-name">{{ getFullName(player) }}</span>
    </div>
    <div
      v-if="showIcons || showCaptain || showLibero"
      class="team-player-captain grid gap-2"
      :class="[`grid-cols-${iconsGap}`]"
    >
      <IconLibero
        v-if="showIcons || showLibero"
        v-tooltip.top="{
          value: player.libero
            ? $t('teams.libero_remove')
            : $t('teams.libero_assign'),
          disabled: tooltipDisabled,
        }"
        :class="{
          'cursor-default pointer-events-auto': tooltipDisabled,
        }"
        @click.stop="setLibero(player.profileId)"
      />
      <IconCaptain
        v-if="showIcons || showCaptain"
        v-tooltip.top="{
          value: player.captain
            ? $t('teams.captain_remove')
            : $t('teams.captain_assign'),
          disabled:
            tooltipDisabled ||
            player.profileId === setCaptainToggleDisabledProfileId,
        }"
        :class="{
          'cursor-default pointer-events-auto':
            tooltipDisabled ||
            player.profileId === setCaptainToggleDisabledProfileId,
        }"
        @click.stop="setCaptain(player.profileId)"
      />
      <PlayerItemIcon
        v-if="!!removePlayer"
        class="hover:text-[var(--danger-color)] opacity-40 hover:opacity-100 cursor-pointer"
        name="ic:baseline-delete-outline"
        v-tooltip.top="{
          value: $t('players.delete'),
          disabled: tooltipDisabled,
        }"
        @click.stop="removePlayer(player.profileId)"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PlayerItem',
}
</script>
