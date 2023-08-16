<script lang="ts" setup>
import { Team } from '@/domain/game'

const props = defineProps({
  localTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  visitorTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
})
</script>

<template>
  <div class="easy-game-teams-sets-won-component">
    <div class="teams-sets-won-team">
      <div class="team-name">
        {{ localTeam.name }}
      </div>
      <div class="sets-count">0</div>
    </div>
    <div class="teams-sets-won-team">
      <div class="team-name">
        {{ visitorTeam.name }}
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
