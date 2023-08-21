<script setup lang="ts">
import { Call } from '@/domain/call'
import { Player, Team } from '@/domain/game'
import { SetSide } from '@/domain/set'

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

const getRotationPlayerDataAtPosition = (
  position: number,
  side: SetSide,
): Player | undefined => {
  const call = side === 'left' ? props.localTeamCall : props.visitorTeamCall

  const profileId = call.currentRotation?.players?.find(
    rotationPlayer => rotationPlayer.position === position,
  )?.profileId

  return (
    call.playersData?.find(player => player.profileId === profileId) ||
    undefined
  )
}

const localTeamRotationPlayersData = computed(() =>
  Array.from({ length: 6 }, (_, i) => i + 1)
    .map(position => getRotationPlayerDataAtPosition(position, 'left'))
    .filter(player => player !== null),
)

const visitorTeamRotationPlayersData = computed(() =>
  Array.from({ length: 6 }, (_, i) => i + 1)
    .map(position => getRotationPlayerDataAtPosition(position, 'right'))
    .filter(player => player !== null),
)
</script>

<template>
  <div class="easy-game-court-component">
    <div class="wrapper">
      <div class="side left">
        <GameCourtPosition
          :position="1"
          :player="localTeamRotationPlayersData[0]"
          serving
        />
        <GameCourtPosition
          :position="2"
          :player="localTeamRotationPlayersData[1]"
        />
        <GameCourtPosition
          :position="3"
          :player="localTeamRotationPlayersData[2]"
        />
        <GameCourtPosition
          :position="4"
          :player="localTeamRotationPlayersData[3]"
        />
        <GameCourtPosition
          :position="5"
          :player="localTeamRotationPlayersData[4]"
        />
        <GameCourtPosition
          :position="6"
          :player="localTeamRotationPlayersData[5]"
        />
      </div>
      <div class="side right">
        <GameCourtPosition
          :position="1"
          :player="visitorTeamRotationPlayersData[0]"
        />
        <GameCourtPosition
          :position="2"
          :player="visitorTeamRotationPlayersData[1]"
        />
        <GameCourtPosition
          :position="3"
          :player="visitorTeamRotationPlayersData[2]"
        />
        <GameCourtPosition
          :position="4"
          :player="visitorTeamRotationPlayersData[3]"
        />
        <GameCourtPosition
          :position="5"
          :player="visitorTeamRotationPlayersData[4]"
        />
        <GameCourtPosition
          :position="6"
          :player="visitorTeamRotationPlayersData[5]"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameCourt',
}
</script>
