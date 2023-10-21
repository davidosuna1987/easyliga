<script lang="ts" setup>
import {
  Coach,
  Team,
  TeamMember,
  TeamSide,
  TeamSideEnum,
  TeamType,
  mapCallPlayerDataToTeamMember,
  mapProfileToTeamMember,
} from '@/domain/team'
import { Call } from '@/domain/call'
import { Set } from '@/domain/set'
import { CurrentRotation, Rotation } from '@/domain/rotation'
import { GameStatus } from '@/domain/game'
import { Timeout } from '@/domain/timeout'
import { SanctionType } from '@/domain/sanction'
import { Player } from '@/domain/player'

const props = defineProps({
  leftSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  rightSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  leftSideTeamCoach: {
    type: Object as PropType<Coach>,
    required: false,
  },
  rightSideTeamCoach: {
    type: Object as PropType<Coach>,
    required: false,
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
  leftSideTeamTimeouts: {
    type: Array as PropType<Timeout[]>,
    required: false,
  },
  rightSideTeamTimeouts: {
    type: Array as PropType<Timeout[]>,
    required: false,
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
  gameEndedAt: {
    type: String,
    required: false,
  },
  timeoutRunning: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'call:unlocked',
  'rotation:lock-toggled',
  'point:sum',
  'point:undo',
  'set:start',
  'timeout:start',
  'observations:dialog',
  'countdown:ended',
])

const sideTeamToSanction = ref<TeamSide>()
const memberToSanction = ref<TeamMember>()

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

const leftSideTeamMembers = computed((): TeamMember[] =>
  props.leftSideTeam.coach
    ? [
        ...props.leftSideTeamCall.playersData.map(
          mapCallPlayerDataToTeamMember,
        ),
        mapProfileToTeamMember(props.leftSideTeam.coach, true),
      ]
    : props.leftSideTeamCall.playersData.map(mapCallPlayerDataToTeamMember),
)

const rightSideTeamMembers = computed((): TeamMember[] =>
  props.rightSideTeam.coach
    ? [
        ...props.rightSideTeamCall.playersData.map(
          mapCallPlayerDataToTeamMember,
        ),
        mapProfileToTeamMember(props.rightSideTeam.coach, true),
      ]
    : props.rightSideTeamCall.playersData.map(mapCallPlayerDataToTeamMember),
)

const teamToSanction = computed((): Team | undefined => {
  switch (sideTeamToSanction.value) {
    case TeamSideEnum.left:
      return props.leftSideTeam
    case TeamSideEnum.right:
      return props.rightSideTeam
    default:
      return undefined
  }
})

const teamMembersToSanction = computed((): TeamMember[] => {
  switch (sideTeamToSanction.value) {
    case TeamSideEnum.left:
      return leftSideTeamMembers.value
    case TeamSideEnum.right:
      return rightSideTeamMembers.value
    default:
      return []
  }
})

const setMemberToSanction = (
  side: TeamSide,
  { player, coach }: { player: Player; coach: Coach },
) => {
  sideTeamToSanction.value = side

  const teamToSanctionMembers =
    side === TeamSideEnum.left
      ? leftSideTeamMembers.value
      : rightSideTeamMembers.value

  memberToSanction.value = player
    ? teamToSanctionMembers.find(
        member => member.profileId === player.profileId,
      )
    : teamMembersToSanction.value.find(member => member.coach)
}

const sumPoint = (type: TeamType) => {
  emit('point:sum', type)
}

const undoLastPoint = () => {
  emit('point:undo')
}
</script>

<template>
  <div class="easy-game-sidebars-court-component">
    <div class="sidebar-wrapper left">
      <RefereeGameCallSidebar
        :team="leftSideTeam"
        :coach="leftSideTeamCoach"
        :call="leftSideTeamCall"
        :rotation="leftSideTeamRotation"
        :timeouts="leftSideTeamTimeouts"
        :currentSet="currentSet"
        :gameStatus="gameStatus"
        @call:unlocked="emit('call:unlocked')"
        @rotation:lock-toggled="emit('rotation:lock-toggled')"
        @timeout:start="emit('timeout:start', $event)"
        @member:clicked="setMemberToSanction(TeamSideEnum.left, $event)"
      />

      <small class="mt-3 block">
        {{ $t('timeouts.requested_short', 2) }}:
        {{ props.leftSideTeamTimeouts?.length ?? 0 }}
      </small>
    </div>
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
        :gameEndedAt="gameEndedAt"
        :timeoutRunning="timeoutRunning"
        @point:sum="sumPoint"
        @point:undo="undoLastPoint"
        @set:start="emit('set:start', $event)"
        @observations:dialog="emit('observations:dialog')"
        @countdown:ended="emit('countdown:ended')"
      />
    </div>
    <div class="sidebar-wrapper right">
      <RefereeGameCallSidebar
        :team="rightSideTeam"
        :coach="rightSideTeamCoach"
        :call="rightSideTeamCall"
        :rotation="rightSideTeamRotation"
        :timeouts="rightSideTeamTimeouts"
        :currentSet="currentSet"
        :gameStatus="gameStatus"
        @call:unlocked="emit('call:unlocked')"
        @rotation:lock-toggled="emit('rotation:lock-toggled')"
        @timeout:start="emit('timeout:start', $event)"
        @member:clicked="setMemberToSanction(TeamSideEnum.right, $event)"
      />

      <small class="mt-3 block">
        {{ $t('timeouts.requested_short', 2) }}:
        {{ props.rightSideTeamTimeouts?.length ?? 0 }}
      </small>
    </div>
    <GameTimeoutSanctionDialog
      v-if="teamToSanction && memberToSanction"
      :visible="!!teamToSanction"
      :type="SanctionType.member"
      :team="teamToSanction"
      :member="memberToSanction"
      :members="teamMembersToSanction"
      @hide="sideTeamToSanction = undefined"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameSidebarsCourt',
}
</script>
