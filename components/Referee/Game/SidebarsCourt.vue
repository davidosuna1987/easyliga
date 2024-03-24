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
import { Game, type GameStatus } from '@/domain/game'
import { Timeout } from '@/domain/timeout'
import {
  Sanction,
  SanctionSeverity,
  SanctionType,
  mergeSanctionsRemovingDuplicates,
} from '@/domain/sanction'
import { Player } from '@/domain/player'
import { GameSignature } from '@/domain/game-signature'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    required: true,
  },
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
  gameSanctions: {
    type: Array as PropType<Sanction[]>,
    required: false,
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
  gameSignatures: {
    type: Array as PropType<GameSignature[]>,
    required: true,
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
  'timeout:init',
  'sanction:stored',
])

const sideTeamToSanction = ref<TeamSide>()
const memberToSanction = ref<TeamMember>()
const sidebarOpened = ref<Record<TeamSide, boolean>>({
  [TeamSideEnum.left]: false,
  [TeamSideEnum.right]: false,
})

const sidebarAction = computed(
  (): Record<TeamSide, 'open' | 'close'> => ({
    [TeamSideEnum.left]: sidebarOpened.value[TeamSideEnum.left]
      ? 'close'
      : 'open',
    [TeamSideEnum.right]: sidebarOpened.value[TeamSideEnum.right]
      ? 'close'
      : 'open',
  }),
)

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

const setSanctions = computed((): Sanction[] =>
  mergeSanctionsRemovingDuplicates(
    props.currentSet.sanctions ?? [],
    props.gameSanctions ?? [],
  ),
)

const leftSideTeamSanctions = computed((): Sanction[] | undefined =>
  setSanctions.value?.filter(
    sanction => sanction.teamId === props.leftSideTeam.id,
  ),
)

const rightSideTeamSanctions = computed((): Sanction[] | undefined =>
  setSanctions.value?.filter(
    sanction => sanction.teamId === props.rightSideTeam.id,
  ),
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

const gameSanctions = computed(() =>
  props.gameSanctions?.filter(
    sanction =>
      sanction.type === SanctionType.member &&
      sanction.severity === SanctionSeverity.game,
  ),
)

const closeSidebars = (): void => {
  sidebarOpened.value[TeamSideEnum.left] = false
  sidebarOpened.value[TeamSideEnum.right] = false
}

const toggleSidebars = (teamSide: TeamSide): void => {
  easyEmit(`game-call-sidebar:${sidebarAction.value[teamSide]}`, teamSide)
}

const setMemberToSanction = (
  side: TeamSide,
  { player, coach }: { player: Player; coach: Coach },
): void => {
  closeSidebars()
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

onMounted(() => {
  easyListen('game-call-sidebar:open', (teamSide: TeamSide) => {
    sidebarOpened.value[teamSide] = true
  })
  easyListen('game-call-sidebar:close', (teamSide: TeamSide) => {
    sidebarOpened.value[teamSide] = false
  })
})

onUnmounted(() => {
  easyUnlisten('game-call-sidebar:open')
  easyUnlisten('game-call-sidebar:close')
})
</script>

<template>
  <div class="easy-game-sidebars-court-component">
    <div
      v-if="gameStatus !== 'finished'"
      class="sidebar-wrapper left"
      :class="{ 'is-opened': !!sidebarOpened[TeamSideEnum.left] }"
      @click.self="closeSidebars()"
    >
      <RefereeGameCallSidebar
        :team="leftSideTeam"
        :side="TeamSideEnum.left"
        :coach="leftSideTeamCoach"
        :call="leftSideTeamCall"
        :rotation="leftSideTeamRotation"
        :timeouts="leftSideTeamTimeouts"
        :currentSet="currentSet"
        :setSanctions="leftSideTeamSanctions"
        :gameSanctions="gameSanctions"
        :gameStatus="gameStatus"
        :gameSignatures="gameSignatures"
        :teamType="
          leftSideTeam.id === game.localTeamId
            ? TeamType.LOCAL
            : TeamType.VISITOR
        "
        @call:unlocked="emit('call:unlocked')"
        @rotation:lock-toggled="emit('rotation:lock-toggled')"
        @timeout:start="emit('timeout:start', $event)"
        @member:clicked="setMemberToSanction(TeamSideEnum.left, $event)"
      />
    </div>
    <div class="score-court relative flex flex-col gap-3">
      <GameScore :currentSet="currentSet" />
      <GameCourt
        :currentSet="currentSet"
        :gameSanctions="gameSanctions"
        :leftSideTeam="leftSideTeam"
        :rightSideTeam="rightSideTeam"
        :leftSideTeamCall="leftSideTeamCall"
        :rightSideTeamCall="rightSideTeamCall"
        :leftSideTeamRotation="leftSideTeamRotation"
        :rightSideTeamRotation="rightSideTeamRotation"
        :leftSideTeamCurrentRotation="leftSideTeamCurrentRotation"
        :rightSideTeamCurrentRotation="rightSideTeamCurrentRotation"
        :leftSideTeamTimeouts="leftSideTeamTimeouts"
        :rightSideTeamTimeouts="rightSideTeamTimeouts"
        :undoPointButtonDisabled="undoPointButtonDisabled"
        :undoLastPointCountdown="undoLastPointCountdown"
        :servingTeamId="servingTeamId"
        :rotations="rotations"
        :gameStatus="gameStatus"
        :gameEndedAt="gameEndedAt"
        :timeoutRunning="timeoutRunning"
        :gameSignatures="gameSignatures"
        @point:sum="sumPoint"
        @point:undo="undoLastPoint"
        @set:start="emit('set:start', $event)"
        @observations:dialog="emit('observations:dialog')"
        @countdown:ended="emit('countdown:ended')"
        @timeout:init="emit('timeout:init', $event)"
        @sanction:stored="emit('sanction:stored', $event)"
        @sidebar:toggle="toggleSidebars($event)"
      />
    </div>
    <div
      v-if="gameStatus !== 'finished'"
      class="sidebar-wrapper right"
      :class="{ 'is-opened': !!sidebarOpened[TeamSideEnum.right] }"
      @click.self="closeSidebars()"
    >
      <RefereeGameCallSidebar
        :team="rightSideTeam"
        :side="TeamSideEnum.right"
        :coach="rightSideTeamCoach"
        :call="rightSideTeamCall"
        :rotation="rightSideTeamRotation"
        :timeouts="rightSideTeamTimeouts"
        :currentSet="currentSet"
        :setSanctions="rightSideTeamSanctions"
        :gameSanctions="gameSanctions"
        :gameStatus="gameStatus"
        :gameSignatures="gameSignatures"
        :teamType="
          rightSideTeam.id === game.localTeamId
            ? TeamType.LOCAL
            : TeamType.VISITOR
        "
        @call:unlocked="emit('call:unlocked')"
        @rotation:lock-toggled="emit('rotation:lock-toggled')"
        @timeout:start="emit('timeout:start', $event)"
        @member:clicked="setMemberToSanction(TeamSideEnum.right, $event)"
      />
    </div>
    <SanctionDialog
      v-if="teamToSanction && memberToSanction"
      :visible="!!teamToSanction"
      :type="SanctionType.member"
      :currentSet="currentSet"
      :gameSanctions="gameSanctions"
      :team="teamToSanction"
      :member="memberToSanction"
      :members="teamMembersToSanction"
      @sanction:stored="emit('sanction:stored', $event)"
      @hide="sideTeamToSanction = undefined"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'RefereeGameSidebarsCourt',
}
</script>
