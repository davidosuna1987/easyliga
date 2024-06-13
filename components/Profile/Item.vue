<script setup lang="ts">
import { getFullName } from '@/domain/player'
import { Profile, AVATAR_STYLES } from '@/domain/profile'
import { getInitials } from '@/domain/utils'

const RemoveIconTypes = {
  trash: 'pepicons-pencil:trash-circle-filled',
  times: 'pepicons-pencil:times',
} as const

type RemoveIcon = keyof typeof RemoveIconTypes

const props = defineProps({
  profile: {
    type: Object as PropType<Profile>,
    required: true,
  },
  removeProfile: {
    type: Function as PropType<(id: number) => void>,
    default: null,
  },
  removeIcon: {
    type: String as PropType<RemoveIcon>,
    default: 'trash',
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
  editable: {
    type: Boolean,
    default: false,
  },
  tooltipDisabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'profile:edit', value: Profile): void
}>()

const { t } = useI18n()

const iconsGap = computed(() => {
  let gap = 0
  if (!!props.removeProfile) gap++
  if (!!props.editable) gap++
  return gap
})

const removeProfileTooltipText = computed(() => {
  return props.removeIcon === 'trash' ? t('profiles.delete') : t('forms.cancel')
})
</script>

<template>
  <div
    class="easy-profile-item easy-game-player-item"
    :class="{
      'is-selectable': selectable,
      'is-selected': selected,
    }"
  >
    <div class="team-player-info">
      <Avatar
        v-if="showAvatar"
        :label="
          profile.avatar
            ? undefined
            : getInitials([profile.firstName, profile.lastName])
        "
        :style="AVATAR_STYLES"
        class="player-avatar"
        :image="profile.avatar"
        shape="circle"
      />
      <span class="player-name">{{ getFullName(profile) }}</span>
    </div>
    <div
      class="team-player-captain flex gap-2"
      :class="[`grid-cols-${iconsGap}`]"
    >
      <PlayerItemIcon
        v-if="editable"
        class="hover:text-[var(--primary-color)] opacity-40 hover:opacity-100 cursor-pointer scale-125"
        name="pepicons-pencil:pen-circle-filled"
        v-tooltip.top="{
          value: $t('profiles.edit'),
          disabled: tooltipDisabled,
        }"
        @click.stop="emit('profile:edit', profile)"
      />
      <PlayerItemIcon
        v-if="!!removeProfile"
        class="hover:text-[var(--danger-color)] opacity-40 hover:opacity-100 cursor-pointer scale-125"
        :name="RemoveIconTypes[removeIcon]"
        v-tooltip.top="{
          value: removeProfileTooltipText,
          disabled: tooltipDisabled,
        }"
        @click.stop="removeProfile(profile.id)"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ProfileItem',
}
</script>
