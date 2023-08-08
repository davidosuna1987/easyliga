<script setup lang="ts">
import { Team } from '@/domain/game'

const props = defineProps({
  team: {
    type: Object as PropType<Team>,
    required: true,
  },
})
</script>

<template>
  <div class="easy-game-team-sidebar-component">
    <h5 class="team-name">{{ props.team.name }}</h5>
    <ul class="team-players-list">
      <li v-for="player in props.team.players" class="team-players-list-item">
        {{ player.firstName }} {{ player.lastName }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameTeamSidebar',
}
</script>
