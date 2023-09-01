<script lang="ts" setup>
import { Team } from '@/domain/team'

const props = defineProps({
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
  <div class="easy-game-teams-sets-won-component">
    <div class="teams-sets-won-team">
      <div class="team-name">
        {{ leftSideTeam.name }}
      </div>
      <div class="sets-count">0</div>
    </div>
    <div class="teams-sets-won-team">
      <div class="team-name">
        {{ rightSideTeam.name }}
      </div>
      <div class="sets-count">0</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameTeamSetsWon',
}
</script>
