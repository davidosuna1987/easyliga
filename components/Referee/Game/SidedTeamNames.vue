<script lang="ts" setup>
import { Team } from '@/domain/team'

defineProps({
  leftSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  rightSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
})
</script>

<template>
  <div class="easy-game-sided-team-names-component">
    <div class="team-name">{{ leftSideTeam.name }}</div>
    <div class="team-name">{{ rightSideTeam.name }}</div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameSidedTeamNames',
}
</script>
