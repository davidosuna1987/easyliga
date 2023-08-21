<script lang="ts" setup>
import { Team } from '@/domain/game'
import { Call } from '@/domain/call'

const props = defineProps({
  localTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  visitorTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  localTeamCall: {
    type: Object as PropType<Call>,
    required: true,
  },
  visitorTeamCall: {
    type: Object as PropType<Call>,
    required: true,
  },
})
</script>

<template>
  <div class="easy-game-sidebars-court-component">
    <RefereeGameCallSidebar
      :team="localTeam"
      :call="localTeamCall"
      @unlocked:call="$emit('unlocked:call')"
    />
    <div class="score-court relative flex flex-col gap-3">
      <GameScore />
      <GameCourt />
    </div>
    <RefereeGameCallSidebar
      :team="visitorTeam"
      :call="visitorTeamCall"
      @unlocked:call="$emit('unlocked:call')"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameSidebarsCourt',
}
</script>
