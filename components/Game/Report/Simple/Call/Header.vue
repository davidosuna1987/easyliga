<script lang="ts" setup>
import { GameReportTeamTypes } from '@/domain/game'
import { Team } from '@/domain/team'

const props = defineProps({
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
})

const { t } = useI18n()
</script>

<template>
  <div class="col-span-12 text-center p-2 border-solid">
    <strong class="uppercase">{{ t('calls.call') }}</strong>
  </div>
  <GameReportSimpleSidedTeam
    class="col-span-6 p-2 border-solid border-t-0 border-r-0"
    :team="localTeam"
    :leftSideTeam="leftSideTeam"
  />
  <GameReportSimpleSidedTeam
    class="col-span-6 p-2 border-solid border-t-0 text-right"
    :team="visitorTeam"
    :leftSideTeam="leftSideTeam"
    direction="right"
  />
  <div class="col-span-1 p-2 border-solid border-t-0 text-center">
    <strong>{{ t('reports.player_number') }}</strong>
  </div>
  <div class="col-span-5 p-2 border-solid border-t-0 border-x-0">
    <strong>{{ t('players.name') }}</strong>
  </div>
  <div class="col-span-1 p-2 border-solid border-t-0 text-center">
    <strong>{{ t('reports.player_number') }}</strong>
  </div>
  <div class="col-span-5 p-2 border-solid border-t-0 border-l-0">
    <strong>{{ t('players.name') }}</strong>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleCallHeader',
}
</script>
