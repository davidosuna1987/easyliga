<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { Call } from '@/domain/call'
import { Player } from '@/domain/player'
import { Team, TeamType } from '@/domain/team'
import { Set, SetSide } from '@/domain/set'

const auth = useAuthStore()

const props = defineProps({
  currentSet: {
    type: Object as PropType<Set>,
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
  leftSideTeamCall: {
    type: Object as PropType<Call>,
    required: true,
  },
  rightSideTeamCall: {
    type: Object as PropType<Call>,
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

const emit = defineEmits(['point:sum', 'point:undo', 'set:start'])

const sumPoint = (type: TeamType) => {
  emit('point:sum', type)
}

const undoLastPoint = () => {
  emit('point:undo')
}

const getRotationPlayerDataAtPosition = (
  position: number,
  side: SetSide,
): Player | undefined => {
  const call =
    side === 'left' ? props.leftSideTeamCall : props.rightSideTeamCall

  const profileId = call.currentRotation?.players?.find(
    rotationPlayer => rotationPlayer.position === position,
  )?.profileId

  return (
    call.playersData?.find(player => player.profileId === profileId) ||
    undefined
  )
}

const leftSideTeamRotationPlayersData = computed(() =>
  Array.from({ length: 6 }, (_, i) => i + 1)
    .map(position => getRotationPlayerDataAtPosition(position, 'left'))
    .filter(player => player !== null),
)

const rightSideTeamRotationPlayersData = computed(() =>
  Array.from({ length: 6 }, (_, i) => i + 1)
    .map(position => getRotationPlayerDataAtPosition(position, 'right'))
    .filter(player => player !== null),
)
</script>

<template>
  <div class="easy-game-court-component">
    <div class="wrapper mb-5">
      <div class="court">
        <div class="side left">
          <GameCourtPosition
            :position="1"
            :player="leftSideTeamRotationPlayersData[0]"
            serving
          />
          <GameCourtPosition
            :position="2"
            :player="leftSideTeamRotationPlayersData[1]"
          />
          <GameCourtPosition
            :position="3"
            :player="leftSideTeamRotationPlayersData[2]"
          />
          <GameCourtPosition
            :position="4"
            :player="leftSideTeamRotationPlayersData[3]"
          />
          <GameCourtPosition
            :position="5"
            :player="leftSideTeamRotationPlayersData[4]"
          />
          <GameCourtPosition
            :position="6"
            :player="leftSideTeamRotationPlayersData[5]"
          />
        </div>
        <div class="side right">
          <GameCourtPosition
            :position="1"
            :player="rightSideTeamRotationPlayersData[0]"
          />
          <GameCourtPosition
            :position="2"
            :player="rightSideTeamRotationPlayersData[1]"
          />
          <GameCourtPosition
            :position="3"
            :player="rightSideTeamRotationPlayersData[2]"
          />
          <GameCourtPosition
            :position="4"
            :player="rightSideTeamRotationPlayersData[3]"
          />
          <GameCourtPosition
            :position="5"
            :player="rightSideTeamRotationPlayersData[4]"
          />
          <GameCourtPosition
            :position="6"
            :player="rightSideTeamRotationPlayersData[5]"
          />
        </div>
      </div>
    </div>

    <template v-if="auth.hasRole('referee')">
      <GameSetActions
        v-if="!currentSet.start || !currentSet.firstServeTeamId"
        :currentSet="currentSet"
        :leftSideTeam="leftSideTeam"
        :rightSideTeam="rightSideTeam"
        @set:start="emit('set:start', $event)"
      />
      <GamePointActions
        v-else
        :currentSet="currentSet"
        :undoPointButtonDisabled="undoPointButtonDisabled"
        :undoLastPointCountdown="undoLastPointCountdown"
        @point:sum="sumPoint"
        @point:undo="undoLastPoint"
      />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameCourt',
}
</script>
