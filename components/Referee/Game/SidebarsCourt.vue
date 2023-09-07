<script lang="ts" setup>
import { Team, TeamType } from '@/domain/team'
import { Call } from '@/domain/call'
import { Set } from '@/domain/set'
import { CurrentRotation } from '@/domain/rotation'

const props = defineProps({
  leftSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  rightSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  leftSideTeamCall: {
    type: Object as PropType<Call>,
    required: true,
  },
  rightSideTeamCall: {
    type: Object as PropType<Call>,
    required: true,
  },
  currentSet: {
    type: Object as PropType<Set>,
    required: true,
  },
  leftSideTeamRotation: {
    type: Object as PropType<CurrentRotation>,
    required: true,
  },
  rightSideTeamRotation: {
    type: Object as PropType<CurrentRotation>,
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
  servingTeamId: {
    type: Number,
    required: false,
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
      :team="leftSideTeam"
      :call="leftSideTeamCall"
      @unlocked:call="emit('unlocked:call')"
    />
    <div class="score-court relative flex flex-col gap-3">
      <GameScore :currentSet="currentSet" />
      <GameCourt
        :currentSet="currentSet"
        :leftSideTeam="leftSideTeam"
        :rightSideTeam="rightSideTeam"
        :leftSideTeamCall="leftSideTeamCall"
        :rightSideTeamCall="rightSideTeamCall"
        :leftSideTeamRotation="leftSideTeamRotation"
        :rightSideTeamRotation="rightSideTeamRotation"
        :undoPointButtonDisabled="undoPointButtonDisabled"
        :undoLastPointCountdown="undoLastPointCountdown"
        :servingTeamId="servingTeamId"
        @point:sum="sumPoint"
        @point:undo="undoLastPoint"
        @set:start="emit('set:start', $event)"
      />
    </div>
    <RefereeGameCallSidebar
      :team="rightSideTeam"
      :call="rightSideTeamCall"
      :currentSet="currentSet"
      @unlocked:call="emit('unlocked:call')"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameSidebarsCourt',
}
</script>
