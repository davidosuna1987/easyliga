<script lang="ts" setup>
import {
  GameReportSimple,
  getSidedTeams,
  mapApiGameReportSimpleToGameReportSimple,
  GameSidedTeams,
  GameLocalVisitorCalls,
  GameLocalVisitorTimeouts,
  getLocalVisitorCalls,
  getLocalVisitorTimeouts,
} from '@/domain/game'
import { Set } from '@/domain/set'
import GameService from '@/services/game'

const { t } = useI18n()
const route = useRoute()
const toast = useEasyToast()
const gameService = new GameService()

const loadingApi = ref(true)
const report = ref<GameReportSimple | null>(null)
const firstSet = ref<Set>()

const getReport = async () => {
  loadingApi.value = true
  const { data, error } = await gameService.reportSimple(
    Number(route.params.game_id),
  )
  loadingApi.value = false

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

const gameLocalVisitorCalls = computed(
  (): GameLocalVisitorCalls | undefined => {
    if (!report.value) return

    return getLocalVisitorCalls(
      report.value.calls,
      report.value.localTeam,
      report.value.visitorTeam,
    )
  },
)

const gameLocalVisitorTimeouts = computed(
  (): GameLocalVisitorTimeouts | undefined => {
    if (!report.value) return

    return getLocalVisitorTimeouts(
      report.value.sets.flatMap(set => set.timeouts ?? []),
      report.value.localTeam,
      report.value.visitorTeam,
    )
  },
)

const print = () => {
  if (!report.value) return

  const originalTitle = document.title
  const titleSlug = report.value.game.name.toLowerCase().replace(/ /g, '-')
  document.title = `acta-${titleSlug}`

  // Simula una pantalla de ordenador cambiando el viewport
  const originalViewport = document.querySelector('meta[name="viewport"]')
  const newViewport = document.createElement('meta')
  newViewport.name = 'viewport'
  newViewport.content = 'width=1400px'

  if (originalViewport) {
    document.head.removeChild(originalViewport)
  }
  document.head.appendChild(newViewport)

  // Imprime la página
  window.print()

  // Restaura el título y el viewport original después de imprimir
  document.title = originalTitle
  document.head.removeChild(newViewport)

  if (originalViewport) {
    document.head.appendChild(originalViewport)
  }
}

onMounted(() => {
  getReport()
})
</script>

<template>
  <div class="easy-game-report-component">
    <div
      v-if="loadingApi"
      class="flex justify-center items-center h-[calc(100dvh-250px)]"
    >
      <LoadingSpinner />
      <span class="text-2xl ml-3">{{ t('games.loading_data') }}</span>
    </div>
    <template v-else>
      <div v-if="report" class="report-wrapper max-w-[1220px] mx-auto">
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
          class="report-main mt-3 grid grid-cols-1 xl:grid-cols-[1fr_1fr_300px_!important] gap-3 items-start"
        >
          <GameReportSimpleCall
            v-if="gameSidedTeams?.leftSideTeam"
            :referee="report.referee"
            :calls="report.calls"
            :localTeam="report.localTeam"
            :visitorTeam="report.visitorTeam"
            :leftSideTeam="gameSidedTeams.leftSideTeam"
          />
          <div class="grid gap-3">
            <GameReportSimpleResult
              v-if="gameSidedTeams && gameLocalVisitorCalls"
              :game="report.game"
              :localTeam="report.localTeam"
              :visitorTeam="report.visitorTeam"
              :leftSideTeam="gameSidedTeams.leftSideTeam"
              :rightSideTeam="gameSidedTeams.rightSideTeam"
              :localTeamCall="gameLocalVisitorCalls.localTeamCall"
              :visitorTeamCall="gameLocalVisitorCalls.visitorTeamCall"
              :sets="report.sets"
            />
            <GameReportSimpleSanction
              v-if="gameSidedTeams"
              :sets="report.sets"
              :calls="report.calls"
              :leftSideTeam="gameSidedTeams.leftSideTeam"
              :rightSideTeam="gameSidedTeams.rightSideTeam"
            />
          </div>
          <div class="flex flex-col gap-3">
            <GameReportSimpleSignatures
              v-if="gameSidedTeams"
              :referee="report.referee"
              :localTeam="report.localTeam"
              :visitorTeam="report.visitorTeam"
              :leftSideTeam="gameSidedTeams.leftSideTeam"
              :rightSideTeam="gameSidedTeams.rightSideTeam"
              :signatures="report.game.signatures ?? []"
            />
            <GameReportSimpleObservations
              :observations="report.game.observations"
            />
          </div>
        </main>
      </div>

      <Button
        class="easy-game-report-print-button float-right mt-3 no-print"
        @click="print"
        size="small"
        variant="primary"
      >
        {{ t('forms.print') }}
      </Button>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimple',
}
</script>
