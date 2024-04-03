<script setup lang="ts">
import { Team } from '@/domain/team'
import { Call } from '@/domain/call'
import { Game } from '@/domain/game'
import { Set } from '@/domain/set'

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    required: true,
  },
  localTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  visitorTeam: {
    type: Object as PropType<Team>,
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
  localTeamCall: {
    type: Object as PropType<Call>,
    required: true,
  },
  visitorTeamCall: {
    type: Object as PropType<Call>,
    required: true,
  },
  sets: {
    type: Array as PropType<Set[]>,
    required: true,
  },
})

const winnerTeam = computed((): Team | undefined => {
  if (!props.game.winnerTeamId) return

  return props.game.winnerTeamId === props.localTeam.id
    ? props.localTeam
    : props.visitorTeam
})
</script>

<template>
  <aside class="easy-game-report-result-component">
    <div class="grid grid-cols-10">
      <GameReportSimpleResultHeader
        :localTeam="localTeam"
        :visitorTeam="visitorTeam"
        :leftSideTeam="leftSideTeam"
      />
      <GameReportSimpleResultItem />
      <GameReportSimpleResultItem />
      <GameReportSimpleResultItem />
      <GameReportSimpleResultItem />
      <GameReportSimpleResultItem />
      <GameReportSimpleResultFooter
        v-if="winnerTeam"
        :game="game"
        :sets="sets"
        :localTeam="localTeam"
        :visitorTeam="visitorTeam"
        :localTeamCall="localTeamCall"
        :visitorTeamCall="visitorTeamCall"
        :winnerTeam="winnerTeam"
      />
    </div>
  </aside>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleResult',
}
</script>
