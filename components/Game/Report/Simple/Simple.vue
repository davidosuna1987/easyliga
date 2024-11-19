<script lang="ts" setup>
import GameService from '@/services/game'
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
import { MIN_CALL_PLAYERS } from '@/domain/call'
import { getFullName } from '@/domain/player'

const { t } = useI18n()
const route = useRoute()
const toast = useEasyToast()
const gameService = new GameService()

const loadingApi = ref(true)
const report = ref<GameReportSimple | null>(null)
const firstSet = ref<Set>()

const gameCallsHavePlayers = computed(() => {
  if (!report.value) return false

  return report.value.calls.every(
    call => call.players?.length ?? 0 > MIN_CALL_PLAYERS,
  )
})

const gameObservationsWarning = computed(() => {
  if (!report.value) return

  return report.value.game.resultsAssignedManuallyBy
    ? report.value.game.resultAssignee?.profile
      ? t('games.partials.assigned_manually_by', {
          name: getFullName(report.value.game.resultAssignee.profile),
        })
      : t('games.partials.assigned_manually')
    : undefined
})

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

const getReport = async () => {
  loadingApi.value = true
  const { data, error } = await gameService.reportSimple(
    Number(route.params.gameId),
  )
  loadingApi.value = false

  if (error.value || !data.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    return
  }

  report.value = mapApiGameReportSimpleToGameReportSimple(data.value.data)
  firstSet.value = report.value.sets[0]

  if (report.value.game.status !== 'finished') {
    document
      .querySelector('.easy-container.game-report')
      ?.classList.remove('game-report')
  }
}

const print = () => {
  if (!report.value || report.value.game.status !== 'finished') return

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
      <template v-if="report?.game.status === 'finished'">
        <div v-if="report" class="report-wrapper max-w-[1220px] mx-auto">
          <Message
            v-if="gameObservationsWarning"
            class="no-print"
            :closable="false"
            type="info"
          >
            {{ gameObservationsWarning }}
          </Message>

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
            :class="[
              'report-main mt-3 grid grid-cols-1 gap-3 items-start',
              gameCallsHavePlayers
                ? 'xl:grid-cols-[1fr_1fr_300px_!important]'
                : 'xl:grid-cols-[500px_1fr_!important]',
            ]"
          >
            <GameReportSimpleCall
              v-if="gameSidedTeams?.leftSideTeam && gameCallsHavePlayers"
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
                v-if="gameSidedTeams && gameCallsHavePlayers"
                :sets="report.sets"
                :calls="report.calls"
                :leftSideTeam="gameSidedTeams.leftSideTeam"
                :rightSideTeam="gameSidedTeams.rightSideTeam"
              />
            </div>
            <div class="flex flex-col gap-3">
              <GameReportSimpleSignatures
                v-if="
                  gameSidedTeams &&
                  gameCallsHavePlayers &&
                  !report.game.resultsAssignedManuallyBy
                "
                :referee="report.referee"
                :localTeam="report.localTeam"
                :visitorTeam="report.visitorTeam"
                :leftSideTeam="gameSidedTeams.leftSideTeam"
                :rightSideTeam="gameSidedTeams.rightSideTeam"
                :signatures="report.game.signatures ?? []"
              />
              <GameReportSimpleObservations
                :observations="report.game.observations"
                :warning="gameObservationsWarning"
              />
            </div>
          </main>
        </div>

        <FormFooterActions
          class="easy-game-report-print-button is-sticky-action no-print"
          :submitLabel="t('forms.print')"
          :hideCancel="true"
          @form:submit="print"
          :fullWidthContainer="false"
        />
      </template>
      <template v-else-if="report?.game">
        <Message :closable="false" type="info">
          {{ t('reports.not_available_until_game_finishes') }}
        </Message>

        <GameInfoHeader
          :game="report.game"
          :division="report.division"
          :category="report.category"
          :gender="report.gender"
          showStatus
          center
        />
      </template>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimple',
}
</script>
