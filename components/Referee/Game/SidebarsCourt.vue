<script lang="ts" setup>
import { Team, TeamType } from '@/domain/team'
import { Call } from '@/domain/call'
import { Set } from '@/domain/set'
import { CurrentRotation, Rotation } from '@/domain/rotation'
import { GameStatus } from '@/domain/game'

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
    type: Object as PropType<Rotation>,
    required: false,
  },
  rightSideTeamRotation: {
    type: Object as PropType<Rotation>,
    required: false,
  },
  leftSideTeamCurrentRotation: {
    type: Object as PropType<CurrentRotation>,
    required: true,
  },
  rightSideTeamCurrentRotation: {
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
  rotations: {
    type: Array as PropType<Rotation[]>,
    required: true,
  },
  gameStatus: {
    type: String as PropType<GameStatus>,
    required: true,
  },
})

const emit = defineEmits([
  'call:unlocked',
  'rotation:lock-toggled',
  'point:sum',
  'point:undo',
  'set:start',
])

const leftSideTeamRotation = computed(() =>
  props.rotations.find(
    rotation => rotation.callId === props.leftSideTeamCall.id,
  ),
)

const rightSideTeamRotation = computed(() =>
  props.rotations.find(
    rotation => rotation.callId === props.rightSideTeamCall.id,
  ),
)

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
      :rotation="leftSideTeamRotation"
      :currentSet="currentSet"
      @call:unlocked="emit('call:unlocked')"
      @rotation:lock-toggled="emit('rotation:lock-toggled')"
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
        :leftSideTeamCurrentRotation="leftSideTeamCurrentRotation"
        :rightSideTeamCurrentRotation="rightSideTeamCurrentRotation"
        :undoPointButtonDisabled="undoPointButtonDisabled"
        :undoLastPointCountdown="undoLastPointCountdown"
        :servingTeamId="servingTeamId"
        :rotations="rotations"
        :gameStatus="gameStatus"
        @point:sum="sumPoint"
        @point:undo="undoLastPoint"
        @set:start="emit('set:start', $event)"
      />
    </div>
    <RefereeGameCallSidebar
      :team="rightSideTeam"
      :call="rightSideTeamCall"
      :rotation="rightSideTeamRotation"
      :currentSet="currentSet"
      @call:unlocked="emit('call:unlocked')"
      @rotation:lock-toggled="emit('rotation:lock-toggled')"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameSidebarsCourt',
}
</script>
