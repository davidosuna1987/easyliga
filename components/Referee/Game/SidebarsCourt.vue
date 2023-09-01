<script lang="ts" setup>
import { Team, TeamType } from '@/domain/team'
import { Call } from '@/domain/call'
import { Set } from '@/domain/set'

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
  currentSet: {
    type: Object as PropType<Set>,
    required: true,
  },
  undoPointButtonDisabled: {
    type: Boolean,
    required: true,
  },
  undoLastPointCountdown: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits([
  'unlocked:call',
  'point:sum',
  'point:undo',
  'set:start',
])

const sumPoint = (type: TeamType) => {
  emit('point:sum', type)
}

const undoLastPoint = () => {
  emit('point:undo')
}
</script>

<template>
  <div class="easy-game-sidebars-court-component">
    <RefereeGameCallSidebar
      :team="localTeam"
      :call="localTeamCall"
      @unlocked:call="emit('unlocked:call')"
    />
    <div class="score-court relative flex flex-col gap-3">
      <GameScore :currentSet="currentSet" />
      <GameCourt
        :currentSet="currentSet"
        :localTeam="localTeam"
        :visitorTeam="visitorTeam"
        :localTeamCall="localTeamCall"
        :visitorTeamCall="visitorTeamCall"
        :undoPointButtonDisabled="undoPointButtonDisabled"
        :undoLastPointCountdown="undoLastPointCountdown"
        @point:sum="sumPoint"
        @point:undo="undoLastPoint"
        @set:start="emit('set:start', $event)"
      />
    </div>
    <RefereeGameCallSidebar
      :team="visitorTeam"
      :call="visitorTeamCall"
      @unlocked:call="emit('unlocked:call')"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameSidebarsCourt',
}
</script>
