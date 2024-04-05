<script setup lang="ts">
import { Call, CallPlayerData } from '@/domain/call'
import { Set } from '@/domain/set'
import { Team } from '@/domain/team'
import { Sanction } from '@/domain/sanction'

const props = defineProps({
  sets: {
    type: Array as PropType<Set[]>,
    required: true,
  },
  calls: {
    type: Array as PropType<Call[]>,
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
})

const gameSanctions = computed((): Sanction[] => {
  return props.sets.flatMap(set => set.sanctions || [])
})

const gamePlayers = computed((): CallPlayerData[] => {
  return props.calls.flatMap(call => call.playersData || [])
})
</script>

<template>
  <article class="easy-game-report-sanction-component place-content-center">
    <div class="no-print">
      <div class="grid grid-cols-8">
        <GameReportSimpleSanctionHeader />
        <template v-for="sanction in gameSanctions">
          <GameReportSimpleSanctionItem
            :sanction="sanction"
            :sets="sets"
            :players="gamePlayers"
            :leftSideTeam="leftSideTeam"
            :rightSideTeam="rightSideTeam"
          />
        </template>
      </div>
    </div>
    <div class="print">
      <div class="grid grid-cols-8">
        <GameReportSimpleSanctionPrintHeader />
        <template v-for="sanction in gameSanctions">
          <GameReportSimpleSanctionPrintItem
            :sanction="sanction"
            :sets="sets"
            :players="gamePlayers"
            :leftSideTeam="leftSideTeam"
            :rightSideTeam="rightSideTeam"
          />
        </template>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleSanction',
}
</script>
