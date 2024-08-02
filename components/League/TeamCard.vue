<script setup lang="ts">
import { Team } from '@/domain/team'
import { getListTagColor } from '@/domain/list'

const props = defineProps({
  team: {
    type: Object as PropType<Team>,
    required: true,
  },
  showGender: {
    type: Boolean,
    default: true,
  },
  showCategory: {
    type: Boolean,
    default: true,
  },
  showIcons: {
    type: Boolean,
    default: true,
  },
  reverseIcons: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
</script>

<template>
  <div
    :class="[
      'easy-league-team-card-component grid gap-1',
      { 'is-selected': selected },
    ]"
  >
    <div class="flex justify-between gap-2">
      <p>{{ team.name }}</p>
      <div
        v-if="team.category || team.gender"
        :class="['flex gap-1', { 'flex-row-reverse': reverseIcons }]"
      >
        <GenderIcon
          v-if="showIcons && showGender && team.gender"
          :name="team.gender?.name"
        />
        <ListTag
          v-else-if="showGender && team.gender"
          :label="`${t(`genders.${team.gender?.name}`)}`"
          :color="getListTagColor(team.gender?.name)"
        />
        <ListTag
          v-if="showCategory && team.category"
          :label="`${t(`categories.${team.category?.name}`)}`"
          color="primary"
        />
      </div>
    </div>
    <small v-if="team.federation" class="opacity-60">
      {{ team.federation?.name }}
    </small>
    <small v-if="team.club" class="opacity-60">{{ team.club?.name }}</small>
  </div>
</template>

<style scoped lang="scss">
.easy-league-team-card-component {
  border: solid 1px var(--input-border-color);
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;

  &.is-selected {
    background-color: var(--primary-color);
    pointer-events: none;
  }

  &:hover {
    background-color: var(--primary-color-medium);
    border-color: var(--primary-color);
  }
}
</style>

<script lang="ts">
export default {
  name: 'LeagueTeamCard',
}
</script>
