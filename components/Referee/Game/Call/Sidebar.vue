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
    <RefereeGameCallItem
      v-for="player in props.call.playersData"
      :key="player.profileId"
      :player="player"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameCallSidebar',
}
</script>
