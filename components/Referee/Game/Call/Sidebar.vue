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
    <h5 class="team-name px-[0.5rem]">{{ props.team.name }}</h5>
    <RefereeGameCallItem
      v-for="player in props.call.playersData"
      :key="player.profileId"
      :player="player"
    />
    <div class="call-status-area p-[0.5rem]">
      <RefereeGameCallStatus
        :call="props.call"
        @unlocked="$emit('unlocked', true)"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameCallSidebar',
}
</script>
