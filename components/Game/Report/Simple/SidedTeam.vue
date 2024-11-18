<script setup lang="ts">
import { GameReportTeamTypes } from '@/domain/game'
import { Team } from '@/domain/team'

const props = defineProps({
  team: {
    type: Object as PropType<Team>,
    required: true,
  },
  leftSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  direction: {
    type: String as PropType<'left' | 'right'>,
    default: 'left',
  },
})
</script>

<template>
  <div
    :class="[
      'flex items-center justify-between gap-2',
      direction === 'right' ? 'flex-row-reverse' : '',
    ]"
  >
    <span>
      {{ team.name }}
    </span>
    <GameReportSimpleTeamIcon
      :type="GameReportTeamTypes[team.id === leftSideTeam.id ? 'A' : 'B']"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleSidedTeam',
}
</script>
