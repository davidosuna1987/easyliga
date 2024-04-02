<script lang="ts" setup>
import {
  GameReportSimple,
  getSidedTeams,
  mapApiGameReportSimpleToGameReportSimple,
  GameSidedTeams,
} from '@/domain/game'
import { Set } from '@/domain/set'
import GameService from '@/services/game'

const route = useRoute()
const toast = useEasyToast()
const gameService = new GameService()

const report = ref<GameReportSimple | null>(null)
const firstSet = ref<Set>()

const getReport = async () => {
  const { data, error } = await gameService.reportSimple(
    Number(route.params.game_id),
  )

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    return
  }

  report.value = mapApiGameReportSimpleToGameReportSimple(data.value.data)
  firstSet.value = report.value.sets[0]
}

const gameSidedTeams = computed((): GameSidedTeams | undefined => {
  if (!firstSet.value || !report.value) return

  return getSidedTeams(
    firstSet.value,
    report.value.localTeam,
    report.value.visitorTeam,
  )
})

const print = () => {
  if (!report.value) return
  const originalTitle = document.title
  const titleSlug = report.value.game.name.toLowerCase().replace(/ /g, '-')
  document.title = `acta-${titleSlug}`
  window.print()
  document.title = originalTitle
}

onMounted(() => {
  getReport()
})
</script>

<template>
  <div v-if="report" class="easy-game-report-component">
    <div class="report-wrapper max-w-[1220px] mx-auto">
      <GameReportSimpleHeader
        v-if="gameSidedTeams"
        :game="report.game"
        :division="report.division"
        :category="report.category"
        :gender="report.gender"
        :sede="report.sede"
        :court="report.court"
        :localTeam="report.localTeam"
        :visitorTeam="report.visitorTeam"
        :leftSideTeam="gameSidedTeams.leftSideTeam"
        :rightSideTeam="gameSidedTeams.rightSideTeam"
      />

      <main
        class="report-main mt-3 grid grid-cols-1 md:[grid-template-columns:1fr_1fr_300px] gap-3"
      >
        <GameReportSimpleCall
          v-if="gameSidedTeams?.leftSideTeam && gameSidedTeams?.rightSideTeam"
          :calls="report.calls"
          :localTeam="report.localTeam"
          :visitorTeam="report.visitorTeam"
          :leftSideTeam="gameSidedTeams.leftSideTeam"
          :rightSideTeam="gameSidedTeams.rightSideTeam"
        />
        <div class="grid gap-3">
          <GameReportSimpleResult />
          <GameReportSimpleSanction />
        </div>
        <div class="flex flex-col gap-3">
          <GameReportSimpleObservations />
          <GameReportSimpleSignatures />
        </div>
      </main>
    </div>

    <Button
      class="easy-game-report-print-button float-right mt-3 no-print"
      @click="print"
      size="small"
      variant="primary"
    >
      Imprimir
    </Button>
  </div>
</template>

<style lang="scss">
.print {
  display: none;
}

.easy-container {
  height: min-content !important;
}

@media print {
  @page {
    size: A4 landscape;
    margin: 0;
  }

  .no-print {
    display: none !important;
  }

  .print {
    display: block !important;
  }

  html {
    margin: 0;
    padding: 0;
    min-height: 0;
    font-size: 11px;
  }

  body {
    margin: 0;
    padding: 0;
    min-height: 0;
  }

  .easy-navbar,
  .easy-footer {
    display: none;
  }

  .easy-main {
    min-height: 0;
    margin-block: 0;
    border-radius: 0;

    .easy-container {
      border-radius: 0;
      box-shadow: none;
      padding: 2.5rem;

      .easy-game-report-component {
        .easy-icon-easy-liga-component {
          width: 50px;
          height: 50px;
        }
      }
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'GameReportSimple',
}
</script>
