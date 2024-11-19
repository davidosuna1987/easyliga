<script setup lang="ts">
import { getFullName } from '@/domain/player'
import { Profile, AVATAR_STYLES } from '@/domain/profile'
import { getInitials } from '@/domain/utils'
import { Role } from '@/domain/role'

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
  roles: {
    type: Array as PropType<Role[]>,
    required: false,
  },
  onRemove: {
    type: Function as PropType<(profileId: number) => void>,
    default: null,
  },
  removeIcon: {
    type: String as PropType<RemoveIcon>,
    default: 'trash',
  },
  removeTooltip: {
    type: String,
    required: false,
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
  tag: {
    type: String,
    required: false,
  },
  clamp: {
    type: Number,
    default: 2,
  },
})

const emit = defineEmits<{
  (e: 'profile:edit', value: Profile): void
}>()

const { t } = useI18n()

const actionCols = computed(() => {
  let cols = 0
  if (!!props.onRemove) cols++
  if (!!props.editable) cols++
  if (!!props.tag) cols++
  return cols
})

const onRemoveTooltipText = computed(() =>
  props.removeTooltip
    ? props.removeTooltip
    : props.removeIcon === 'trash'
    ? t('profiles.delete')
    : t('forms.cancel'),
)
</script>

<template>
  <div
    :data-user-id="profile.userId"
    :data-profile-id="profile.id"
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
      <span :class="['player-name', `line-clamp-${clamp}`]">{{
        getFullName(profile)
      }}</span>
      <div v-if="roles" class="player-roles flex gap-1">
        <Badge
          v-for="role of roles"
          class="[--badge-text-color:var(--text-color)] dark:[--badge-text-color:white]"
          :value="role"
          :style="{
            background: 'transparent !important',
            border: 'solid 1px var(--primary-color)',
            fontWeight: 'normal',
            height: '14px',
            padding: '0px 5px',
            lineHeight: 1.05,
            color: 'var(--badge-text-color)',
          }"
        />
      </div>
    </div>
    <div
      class="team-player-captain flex gap-2"
      :class="[`[grid-template-columns:repeat(${actionCols},minmax(0,1fr))]`]"
    >
      <Tag
        v-if="tag"
        :class="['py-0.5 px-2 self-center']"
        :value="tag"
        rounded
      />
      <PlayerItemIcon
        v-if="editable"
        class="hover:text-[var(--primary-color)] opacity-40 hover:opacity-100 cursor-pointer scale-125"
        name="pepicons-pencil:pen-circle-filled"
        v-tooltip.top="{
          value: t('profiles.edit'),
          disabled: tooltipDisabled,
        }"
        @click.stop="emit('profile:edit', profile)"
      />
      <PlayerItemIcon
        v-if="!!onRemove"
        class="hover:text-[var(--danger-color)] opacity-40 hover:opacity-100 cursor-pointer scale-125"
        :name="RemoveIconTypes[removeIcon]"
        v-tooltip.top="{
          value: onRemoveTooltipText,
          disabled: tooltipDisabled,
        }"
        @click.stop="onRemove(profile.id)"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ProfileItem',
}
</script>
