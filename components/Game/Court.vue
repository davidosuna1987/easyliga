<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { Call } from '@/domain/call'
import { Player } from '@/domain/player'
import { Team, TeamType } from '@/domain/team'
import { Set, SetSide } from '@/domain/set'
import { CurrentRotation, Rotation, POSITIONS } from '@/domain/rotation'
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
  timeoutRunning: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['point:sum', 'point:undo', 'set:start'])

const waitingForPlayerChanges = computed(() =>
  props.rotations.some(rotation => !rotation.locked),
)

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

  const sideRotation =
    side === SetSide.LEFT
      ? props.leftSideTeamRotation
      : props.rightSideTeamRotation

  const inCourtProfileId = sideRotation?.players.find(
    player => player.currentPosition === position,
  )?.inCourtProfileId

  return (
    call.playersData?.find(player => player.profileId === inCourtProfileId) ??
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
            v-for="position in POSITIONS"
            :key="position"
            :position="position"
            :player="leftSideTeamCurrentRotationPlayersData[position - 1]"
            :serving="position === 1 && servingTeamId === leftSideTeam.id"
            :captainProfileId="leftSideTeamRotation?.inCourtCaptainProfileId"
          />
        </div>
        <div class="side right">
          <GameCourtPosition
            v-for="position in POSITIONS"
            :key="position"
            :position="position"
            :player="rightSideTeamCurrentRotationPlayersData[position - 1]"
            :serving="position === 1 && servingTeamId === rightSideTeam.id"
            :captainProfileId="rightSideTeamRotation?.inCourtCaptainProfileId"
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
      <div
        v-else-if="waitingForPlayerChanges"
        class="actions grid place-content-center"
      >
        <Button
          class="px-12"
          :label="$t('rotations.waiting_player_changes')"
          outlined
          :loading="true"
          :disabled="true"
        />
      </div>
      <div v-else-if="timeoutRunning" class="actions grid place-content-center">
        <Button
          class="px-12"
          :label="$t('timeouts.running')"
          severity="danger"
          outlined
          :loading="true"
          :disabled="true"
        />
      </div>
      <div v-else-if="gameStatus === 'playing'" class="flex flex-col gap-8">
        <GameChangesActions
          class="w-full"
          :leftSideTeamCall="leftSideTeamCall"
          :rightSideTeamCall="rightSideTeamCall"
          :leftSideTeamRotation="leftSideTeamRotation"
          :rightSideTeamRotation="rightSideTeamRotation"
        />
        <GamePointActions
          class="w-full"
          :currentSet="currentSet"
          :undoPointButtonDisabled="undoPointButtonDisabled"
          :undoLastPointCountdown="undoLastPointCountdown"
          @point:sum="sumPoint"
          @point:undo="undoLastPoint"
        />
      </div>
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
