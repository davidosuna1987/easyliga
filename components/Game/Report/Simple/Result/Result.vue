<script setup lang="ts">
import { Team } from '@/domain/team'
import { Call } from '@/domain/call'
import { Game } from '@/domain/game'
import { Set } from '@/domain/set'
import { MIN_SETS_ROW_LENGTH } from '@/domain/report'

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

const setRowLength = MIN_SETS_ROW_LENGTH

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
      <template v-for="i in setRowLength">
        <GameReportSimpleResultItem
          :set="sets[i - 1]"
          :localTeam="localTeam"
          :visitorTeam="visitorTeam"
          :localTeamCall="localTeamCall"
          :visitorTeamCall="visitorTeamCall"
        />
      </template>
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
