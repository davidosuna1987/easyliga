<script setup lang="ts">
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
  <header class="col-span-10 border-solid p-2 grid place-content-center">
    <strong class="uppercase">{{ t('reports.result.title') }}</strong>
  </header>

  <GameReportSimpleSidedTeam
    :team="localTeam"
    :leftSideTeam="leftSideTeam"
    class="col-span-5 border-solid border-r-0 p-2"
  />

  <GameReportSimpleSidedTeam
    :team="visitorTeam"
    :leftSideTeam="leftSideTeam"
    direction="right"
    class="col-span-5 border-solid p-2"
  />

  <div class="grid place-content-center p-2 border-solid border-r-0 border-t-0">
    <strong>{{ t('reports.result.timeouts') }}</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-t-0">
    <strong>{{ t('reports.result.replacements') }}</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-x-0 border-t-0">
    <strong>{{ t('reports.result.won_points') }}</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-t-0">
    <strong>{{ t('reports.result.points') }}</strong>
  </div>

  <div
    class="grid grid-cols-2 place-content-center col-span-2 p-2 border-solid border-x-0 text-center border-t-0"
  >
    <strong class="uppercase">{{ t('reports.result.set') }}</strong>
    <span class="font-2xs place-self-center">
      ({{ t('reports.result.duration').toLocaleLowerCase() }})
    </span>
  </div>

  <div class="grid place-content-center p-2 border-solid border-t-0">
    <strong>{{ t('reports.result.points') }}</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-x-0 border-t-0">
    <strong>{{ t('reports.result.won_points') }}</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-t-0">
    <strong>{{ t('reports.result.replacements') }}</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-l-0 border-t-0">
    <strong>{{ t('reports.result.timeouts') }}</strong>
  </div>

  <div class="col-span-10 border-solid border-b-0"></div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleResultHeader',
}
</script>
