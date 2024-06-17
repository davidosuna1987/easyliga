<script setup lang="ts">
import { Player, getFullName } from '@/domain/player'
import { CallPlayerData } from '@/domain/call'
import { TeamMember } from '@/domain/team'
import { Sanction } from '@/domain/sanction'
import { getInitials } from '@/domain/utils'
import { AVATAR_STYLES, Profile } from '@/domain/profile'

const RemoveIconTypes = {
  trash: 'pepicons-pencil:trash-circle-filled',
  times: 'pepicons-pencil:times',
} as const

type RemoveIcon = keyof typeof RemoveIconTypes

const props = defineProps({
  player: {
    type: Object as PropType<Player | CallPlayerData | TeamMember>,
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
  removeIcon: {
    type: String as PropType<RemoveIcon>,
    default: 'trash',
  },
  setShirtNumberUpdatePlayer: {
    type: Function as PropType<(player: Player | TeamMember) => void>,
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
  showAvatar: {
    type: Boolean,
    default: true,
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
  sanction: {
    type: Object as PropType<Sanction>,
    required: false,
  },
  editable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'profile:edit', value: Profile | undefined): void
}>()

const { t } = useI18n()

const tooltipDisabled = computed(
  () => !!props.tooltipsDisabled || (props.selectable && !props.selected),
)

const iconsGap = computed(() => {
  let gap = 0
  if (!!props.removePlayer) gap++
  if (!!props.showCaptain) gap++
  if (!!props.showLibero) gap++
  if (!!props.editable) gap++
  return gap
})

const removeProfileTooltipText = computed(() => {
  return props.removeIcon === 'trash' ? t('players.delete') : t('forms.cancel')
})
</script>

<template>
  <div
    class="easy-game-player-item"
    :class="{
      'is-selectable': selectable,
      'is-selected': selected,
      'is-captain': player.captain,
      'is-libero': player.libero,
    }"
  >
    <div class="team-player-info">
      <SanctionItem
        v-if="props.sanction"
        :severity="props.sanction.severity"
        size="1rem"
      />
      <Avatar
        :label="
          player.avatar
            ? undefined
            : getInitials([player.firstName, player.lastName])
        "
        :style="AVATAR_STYLES"
        class="player-avatar"
        :image="player.avatar"
        shape="circle"
      />
      <IconShirtNumber
        v-tooltip.top="{
          value: t('shirts.number_change'),
          disabled: tooltipDisabled,
        }"
        :shirtNumber="player.shirtNumber"
        @click.stop="setShirtNumberUpdatePlayer(player)"
      />
      <span class="player-name">{{ getFullName(player) }}</span>
    </div>
    <div
      v-if="showIcons || showCaptain || showLibero"
      class="team-player-captain flex gap-2"
      :class="[`grid-cols-${iconsGap}`]"
    >
      <IconLibero
        v-if="showIcons || showLibero"
        v-tooltip.top="{
          value: player.libero
            ? t('teams.libero_remove')
            : t('teams.libero_assign'),
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
            ? t('teams.captain_remove')
            : t('teams.captain_assign'),
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
        v-if="!!editable"
        class="hover:text-[var(--primary-color)] opacity-40 hover:opacity-100 cursor-pointer scale-125"
        name="pepicons-pencil:pen-circle-filled"
        v-tooltip.top="{
          value: t('profiles.edit'),
          disabled: tooltipDisabled,
        }"
        @click.stop="emit('profile:edit', (player as Player).profile)"
      />
      <PlayerItemIcon
        v-if="!!removePlayer"
        class="hover:text-[var(--danger-color)] opacity-40 hover:opacity-100 cursor-pointer scale-125"
        :name="RemoveIconTypes[removeIcon]"
        v-tooltip.top="{
          value: removeProfileTooltipText,
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
