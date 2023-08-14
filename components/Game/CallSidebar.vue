<script setup lang="ts">
import { Team } from '@/domain/game'
import { Call } from '@/domain/call'

const props = defineProps({
  team: {
    type: Object as PropType<Team>,
    required: true,
  },
  call: {
    type: Object as PropType<Call>,
    required: true,
  },
})
</script>

<template>
  <div class="easy-game-call-sidebar-component">
    <h5 class="call-name">{{ props.team.name }}</h5>
    <ul class="call-players-list">
      <li
        v-for="player in props.call.playersData"
        class="call-players-list-item"
      >
        {{ player.firstName }} {{ player.lastName }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameCallSidebar',
}
</script>
