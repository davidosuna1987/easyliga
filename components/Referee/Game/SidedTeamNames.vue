<script lang="ts" setup>
import {
  CustomTeamsShirtColor,
  getCustomShirtColorByTeam,
  Team,
} from '@/domain/team'

const props = defineProps({
  leftSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  rightSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  customTeamsShirtColor: {
    type: Object as PropType<CustomTeamsShirtColor>,
    required: true,
  },
})
</script>

<template>
  <div class="easy-game-sided-team-names-component">
    <div class="team-name">
      <span
        :class="[
          'color-trigger',
          `shirt-item-${getCustomShirtColorByTeam(
            customTeamsShirtColor,
            leftSideTeam,
          )}`,
        ]"
        @click="$emit('shirtColorDialog:open', leftSideTeam)"
      ></span>
      <span>{{ leftSideTeam.name }}</span>
    </div>
    <div class="team-name">
      <span
        :class="[
          'color-trigger',
          `shirt-item-${getCustomShirtColorByTeam(
            customTeamsShirtColor,
            rightSideTeam,
          )}`,
        ]"
        @click="$emit('shirtColorDialog:open', rightSideTeam)"
      ></span>
      <span>{{ rightSideTeam.name }}</span>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameSidedTeamNames',
}
</script>
