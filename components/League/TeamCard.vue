<script setup lang="ts">
import { Team } from '@/domain/team'
import { getListTagColor } from '@/domain/list'
import { IconNames } from '@/domain/icon'
import { LeagueShowTeam } from '@/domain/league-show'

const props = defineProps({
  team: {
    type: Object as PropType<Team | LeagueShowTeam>,
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
  hoverable: {
    type: Boolean,
    default: false,
  },
  onRemove: {
    type: Function as PropType<() => void>,
    required: false,
  },
})

const { t } = useI18n()
</script>

<template>
  <div
    :class="[
      'easy-league-team-card-component grid gap-1',
      { 'is-selected': selected },
      { 'is-hoverable': hoverable },
    ]"
    :data-team-id="team.id"
  >
    <div class="flex justify-between items-center gap-2">
      <div class="flex-1">
        <div class="flex justify-between gap-2">
          <p>{{ team.name }}</p>
          <div
            v-if="team.category || team.gender"
            :class="[
              'flex items-start gap-1',
              { 'flex-row-reverse': reverseIcons },
            ]"
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

      <div v-if="onRemove" class="actions" @click="onRemove">
        <Icon :name="IconNames.trash" size="1.5rem" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.easy-league-team-card-component {
  position: relative;
  border: solid 1px var(--input-border-color);
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;

  .actions {
    position: absolute;
    left: 100%;
    bottom: 100%;
    color: white;
    display: grid;
    place-items: center;
    translate: -55% 75%;
    cursor: pointer;

    &:hover {
      color: var(--text-danger);
    }
  }

  &.is-selected {
    background-color: var(--primary-color);
    pointer-events: none;
  }

  &.is-hoverable {
    cursor: pointer;

    &:hover {
      background-color: var(--primary-color-medium);
      border-color: var(--primary-color);
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'LeagueTeamCard',
}
</script>
