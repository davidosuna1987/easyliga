<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { Call } from '@/domain/call'
import { Player } from '@/domain/player'
import { Team, TeamType } from '@/domain/team'
import { Set, SetSide } from '@/domain/set'
import { CurrentRotation, Rotation } from '@/domain/rotation'
import { GameStatus } from '@/domain/game'

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
    side === SetSide.LEFT ? props.leftSideTeamCall : props.rightSideTeamCall

  const currentRotation =
    side === SetSide.LEFT
      ? props.leftSideTeamCurrentRotation
      : props.rightSideTeamCurrentRotation

  const profileId = Number(
    Object.entries(currentRotation).find(([_, pos]) => pos === position)?.[0],
  )

  return (
    call.playersData?.find(player => player.profileId === profileId) ??
    undefined
  )
}

const leftSideTeamCurrentRotationPlayersData = computed(() =>
  Array.from({ length: 6 }, (_, i) => i + 1)
    .map(position => getRotationPlayerDataAtPosition(position, SetSide.LEFT))
    .filter(player => player !== null),
)

const rightSideTeamCurrentRotationPlayersData = computed(() =>
  Array.from({ length: 6 }, (_, i) => i + 1)
    .map(position => getRotationPlayerDataAtPosition(position, SetSide.RIGHT))
    .filter(player => player !== null),
)

const setActionsDisabled = computed(() => {
  return (
    props.rotations?.length !== 2 ||
    props.rotations?.some(rotation => rotation.players.length < 6)
  )
})
</script>

<template>
  <div class="easy-game-court-component">
    <div class="wrapper mb-5">
      <div class="court">
        <div class="side left">
          <GameCourtPosition
            :position="1"
            :player="leftSideTeamCurrentRotationPlayersData[0]"
            :serving="servingTeamId === leftSideTeam.id"
          />
          <GameCourtPosition
            :position="2"
            :player="leftSideTeamCurrentRotationPlayersData[1]"
          />
          <GameCourtPosition
            :position="3"
            :player="leftSideTeamCurrentRotationPlayersData[2]"
          />
          <GameCourtPosition
            :position="4"
            :player="leftSideTeamCurrentRotationPlayersData[3]"
          />
          <GameCourtPosition
            :position="5"
            :player="leftSideTeamCurrentRotationPlayersData[4]"
          />
          <GameCourtPosition
            :position="6"
            :player="leftSideTeamCurrentRotationPlayersData[5]"
          />
        </div>
        <div class="side right">
          <GameCourtPosition
            :position="1"
            :player="rightSideTeamCurrentRotationPlayersData[0]"
            :serving="servingTeamId === rightSideTeam.id"
          />
          <GameCourtPosition
            :position="2"
            :player="rightSideTeamCurrentRotationPlayersData[1]"
          />
          <GameCourtPosition
            :position="3"
            :player="rightSideTeamCurrentRotationPlayersData[2]"
          />
          <GameCourtPosition
            :position="4"
            :player="rightSideTeamCurrentRotationPlayersData[3]"
          />
          <GameCourtPosition
            :position="5"
            :player="rightSideTeamCurrentRotationPlayersData[4]"
          />
          <GameCourtPosition
            :position="6"
            :player="rightSideTeamCurrentRotationPlayersData[5]"
          />
        </div>
      </div>
    </div>

    <template v-if="auth.hasRole('referee')">
      <GameSetActions
        v-if="
          !currentSet.localTeamSide ||
          !currentSet.visitorTeamSide ||
          !currentSet.firstServeTeamId ||
          ['warmup', 'resting'].includes(gameStatus)
        "
        :currentSet="currentSet"
        :leftSideTeam="leftSideTeam"
        :rightSideTeam="rightSideTeam"
        :disabled="setActionsDisabled"
        @set:start="emit('set:start', $event)"
      />
      <GamePointActions
        v-else-if="gameStatus === 'playing'"
        :currentSet="currentSet"
        :undoPointButtonDisabled="undoPointButtonDisabled"
        :undoLastPointCountdown="undoLastPointCountdown"
        @point:sum="sumPoint"
        @point:undo="undoLastPoint"
      />
      <div
        v-else-if="gameStatus === 'finished'"
        class="actions grid place-content-center"
      >
        <Button
          class="px-12"
          :label="$t('games.status.finished')"
          outlined
          disabled
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameCourt',
}
</script>
