<script setup lang="ts">
import LeagueService from '@/services/league'
// import {
//   League,
//   mapApiLeagueToLeague,
// } from '@/domain/league'
import {
  LeagueShow,
  LeagueShowGame,
  LeagueShowTeam,
  mapApiLeagueShowGamesToApiLeagueShowGameMatchdays,
  mapApiLeagueShowGameToLeagueShowGame,
  mapApiLeagueShowToLeagueShow,
} from '@/domain/league-show'
// import { Game } from '@/domain/game'
// import { Team } from '@/domain/team'
import { getListTagColor } from '@/domain/list'
import { User } from '@/domain/user'

const props = defineProps({
  leagueId: {
    type: Number,
    required: false,
  },
  showActions: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
const route = useRoute()
const toast = useEasyToast()
const leagueService = new LeagueService()

const requestedLeagueId = ref<number | undefined>(
  Number(route.params.leagueId) || props.leagueId,
)

// const league = ref<League>()
const league = ref<LeagueShow>()
const showGenerateGamesDialogForm = ref<boolean>(false)
const showAddTeamDialogForm = ref<boolean>(false)
const showRemoveTeamAlertDialog = ref<boolean>(false)
const showRefereeSelectorDialogForm = ref<LeagueShowGame>()
const showGameSetPartialsDialogForm = ref<LeagueShowGame>()
const teamToRemove = ref<LeagueShowTeam>()
const filter = ref<'classification' | 'matchdays'>('classification')
const loadingApi = ref<boolean>(true)
const loadingMatchdays = ref<boolean>(false)
const loadingGame = ref<boolean>(false)
const apiError = ref<string>()

const orderedMatchdays = computed(() => {
  return league.value?.matchdays?.sort(
    (a, b) => (a.matchday ?? 0) - (b.matchday ?? 0),
  )
})

const showMatchdays = computed(
  () =>
    league.value?.matchdays?.length === league.value?.matchdaysCount &&
    !showLoadingMatchdays.value,
)

const showLoadingMatchdays = computed(
  () => loadingMatchdays.value || loadingGame.value,
)

const getLeague = async () => {
  if (!requestedLeagueId.value) return

  loadingApi.value = true

  // const { data, error } = await leagueService.get(
  //   requestedLeagueId.value,
  //   {
  //     with: 'federation,division,games.referee.profile,teams.federation,teams.gender,teams.category,category,gender',
  //   },
  // )

  const { data, error } = await leagueService.show(requestedLeagueId.value)

  try {
    if (error.value) {
      toast.mapError(Object.values(error.value?.data?.errors), false)
    } else if (data.value) {
      // league.value = mapApiLeagueToLeague(data.value.data.league)
      league.value = mapApiLeagueShowToLeagueShow(data.value.data.league)
    }
  } catch (e) {
    apiError.value = t('errors.whoops')
  } finally {
    loadingApi.value = false
    showGenerateGamesDialogForm.value = false
    getAllLeagueMatchdayGames(5)
  }
}

const getAllLeagueMatchdayGames = async (range?: number) => {
  if (!league.value?.matchdaysCount) return

  loadingMatchdays.value = true

  let promises: Promise<void>[] = []

  if (range) {
    const ranges = Array.from(
      { length: Math.ceil(league.value.matchdaysCount / range) },
      (_, i) => {
        const start = i * 5 + 1 // Inicio del rango
        const end = Math.min(start + 4, league.value?.matchdaysCount ?? 0) // Fin del rango (máximo matchdaysCount)
        return `${start}:${end}`
      },
    )
    promises = ranges.map(range => getLeagueMatchdayGamesByMatchday(range))
  } else {
    promises = Array.from(
      { length: league.value.matchdaysCount },
      (_, matchday) => getLeagueMatchdayGamesByMatchday(matchday + 1),
    )
  }

  await Promise.all(promises)

  loadingMatchdays.value = false
}

const getLeagueMatchdayGamesByMatchday = async (matchday: string | number) => {
  if (!league.value) return

  if (!league.value.matchdays) league.value.matchdays = []

  loadingGame.value = true

  const { data, error } = await leagueService.showMatchdayGames(
    league.value.id,
    matchday,
  )

  try {
    if (error.value) {
      toast.mapError(Object.values(error.value?.data?.errors), false)
    } else if (data.value) {
      // const leagueShowGames = data.value.data.games.map(
      //   mapApiLeagueShowGameToLeagueShowGame,
      // )
      // league.value.matchdays?.push({
      //   matchday,
      //   games: leagueShowGames,
      // })
      const matchdays = mapApiLeagueShowGamesToApiLeagueShowGameMatchdays(
        data.value.data.games,
      )
      league.value.matchdays = league.value.matchdays?.concat(matchdays)
    }
  } catch (e) {
    apiError.value = t('errors.whoops')
  } finally {
    loadingGame.value = false
    showGenerateGamesDialogForm.value = false
  }
}

const getLeagueGame = async (gameId: number) => {
  if (!league.value) return

  if (!league.value.matchdays) league.value.matchdays = []

  loadingGame.value = true

  const { data, error } = await leagueService.showGame(league.value.id, gameId)

  try {
    if (error.value) {
      toast.mapError(Object.values(error.value?.data?.errors), false)
    } else if (data.value) {
      const leagueShowGame = mapApiLeagueShowGameToLeagueShowGame(
        data.value.data.game,
      )
      const matchday = league.value.matchdays?.find(
        m => m.matchday === leagueShowGame.matchday,
      )

      if (matchday) {
        const gameIndex = matchday.games.findIndex(
          g => g.id === leagueShowGame.id,
        )

        if (gameIndex !== -1) {
          matchday.games[gameIndex] = leagueShowGame
        } else {
          matchday.games.push(leagueShowGame)
        }
      }
    }
  } catch (e) {
    apiError.value = t('errors.whoops')
  } finally {
    loadingGame.value = false
    showGenerateGamesDialogForm.value = false
  }
}

const handleOnRemoveTeam = async (team: LeagueShowTeam) => {
  if (!league.value) return

  loadingApi.value = true

  const { data, error } = await leagueService.removeTeam(
    league.value?.id,
    team.id,
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    toast.success(t('teams.deleted'))
    league.value?.teams?.splice(
      league.value?.teams?.findIndex(t => t.id === team.id),
      1,
    )
  }

  teamToRemove.value = undefined
  showRemoveTeamAlertDialog.value = false
  loadingApi.value = false
}

const handleGenerateGamesDialogShow = () => {
  if (league.value?.teams && league.value?.teams?.length < 2) {
    toast.error(t('games.matchdays.error_only_one_team'))
    return
  }
  showGenerateGamesDialogForm.value = true
}

const handleGenerateGamesDialogHide = () => {
  showGenerateGamesDialogForm.value = false
}

const handleShowAddTeamDialog = () => {
  showAddTeamDialogForm.value = true
}

const handleShowRemoveTeamAlertDialog = (team: LeagueShowTeam) => {
  showRemoveTeamAlertDialog.value = true
  teamToRemove.value = team
}

const handleTeamAdded = (team: LeagueShowTeam) => {
  league.value?.teams?.push(team)
  showAddTeamDialogForm.value = false
}

const handleRefereeAssigned = (referee: User) => {
  if (!showRefereeSelectorDialogForm.value) return

  if (referee.id !== showRefereeSelectorDialogForm.value.refereeId) {
    // getLeague()
    getLeagueGame(showRefereeSelectorDialogForm.value.id)
  }

  showRefereeSelectorDialogForm.value = undefined
}

const handlePartialsAssigned = () => {
  if (!showGameSetPartialsDialogForm.value) return
  // getLeague()
  getLeagueGame(showGameSetPartialsDialogForm.value.id)
  showGameSetPartialsDialogForm.value = undefined
}

onMounted(() => {
  getLeague()
})
</script>

<template>
  <div class="easy-league-show-component">
    <Loading v-if="loadingApi" />

    <template v-else-if="league">
      <header class="mb-8">
        <Heading position="center">{{ league.name }}</Heading>
        <Heading tag="h6" class="mb-5" position="center">
          {{ league.federation?.name }}
        </Heading>
        <div class="flex justify-center gap-5 relative bottom-2">
          <ListTag
            :label="`${t(`categories.${league.category?.name}`)}`"
            color="primary"
            size="large"
          />
          <ListTag
            :label="`${t(`genders.${league.gender?.name}`)}`"
            :color="getListTagColor(league.gender?.name)"
            size="large"
          />
        </div>
      </header>

      <div class="flex flex-col sm:flex-row sm:gap-8">
        <div class="teams">
          <header class="flex justify-between items-center mb-4">
            <Heading class="flex items-center gap-2" tag="h6">
              {{ t('teams.team', 2) }}
              <Badge
                class="bg-transparent [border:solid_1px_var(--primary-color)] [border-radius:50%_!important] w-6 h-6 [display:inline-flex_!important] items-center justify-center [padding:0_!important] font-normal text-[var(--text-color)]"
                >{{ league.teams?.length }}</Badge
              >
            </Heading>
            <ListActionButton
              v-if="!showMatchdays"
              :label="t('teams.add')"
              :onClick="handleShowAddTeamDialog"
            />
          </header>
          <EasyGrid :gap="3">
            <LeagueTeamCard
              v-for="team in league.teams"
              :team="team"
              :showCategory="team.category?.id !== league.category?.id"
              :onRemove="
                showMatchdays
                  ? undefined
                  : () => handleShowRemoveTeamAlertDialog(team)
              "
              reverseIcons
            />
          </EasyGrid>
        </div>

        <LoadingLabel
          v-if="showLoadingMatchdays"
          :label="t('games.loading')"
          class="justify-center flex-1 self-start"
        />
        <template v-else>
          <div v-if="showMatchdays" class="league-content">
            <div class="flex justify-center gap-3 mt-5 mb-3 md:mt-0">
              <Button
                :label="t('leagues.classification')"
                :outlined="filter !== 'classification'"
                size="small"
                @click.prevent="filter = 'classification'"
              />
              <Button
                :label="t('games.matchdays.label')"
                :outlined="filter !== 'matchdays'"
                size="small"
                @click.prevent="filter = 'matchdays'"
              />
            </div>

            <LeagueClassificationTable
              v-show="filter === 'classification'"
              :classification="league.classification || []"
            />

            <EasyGrid v-show="filter === 'matchdays'" class="relative" :gap="3">
              <template
                v-for="matchday in orderedMatchdays"
                :key="matchday.matchday"
              >
                <LeagueMatchday
                  :matchday="matchday"
                  :showActions="showActions"
                  @referee:assign="
                    showRefereeSelectorDialogForm = $event as LeagueShowGame
                  "
                  @game:set-partials="
                    showGameSetPartialsDialogForm = $event as LeagueShowGame
                  "
                />
              </template>
            </EasyGrid>
          </div>
          <div
            v-else
            class="matchdays relative is-sticky-action is-sticky-action__sm flex flex-col items-center gap-3"
          >
            <p>{{ t('games.matchdays.not_generated') }}</p>
            <Button
              :label="t('games.matchdays.generate')"
              size="small"
              @click.prevent="handleGenerateGamesDialogShow"
            />
          </div>
        </template>
      </div>

      <LeagueTeamAddDialogForm
        :visible="!!showAddTeamDialogForm"
        :league="league"
        :selectedTeams="league.teams"
        @hide="showAddTeamDialogForm = false"
        @team:added="handleTeamAdded"
      />

      <GameRefereeAssignFormDialog
        v-if="!!showRefereeSelectorDialogForm"
        :visible="!!showRefereeSelectorDialogForm"
        :game="showRefereeSelectorDialogForm"
        @referee:assigned="handleRefereeAssigned"
        @hide="showRefereeSelectorDialogForm = undefined"
      />

      <GamePartialsAssignFormDialog
        v-if="!!showGameSetPartialsDialogForm"
        :visible="!!showGameSetPartialsDialogForm"
        :game="showGameSetPartialsDialogForm"
        @partials:assigned="handlePartialsAssigned"
        @hide="showGameSetPartialsDialogForm = undefined"
      />

      <AlertDialog
        v-if="!!teamToRemove"
        :visible="!!showRemoveTeamAlertDialog"
        :title="t('teams.delete')"
        :message="t('leagues.remove_team_alert')"
        severity="danger"
        :acceptLabel="t('forms.delete')"
        :disabled="loadingApi"
        @accepted="handleOnRemoveTeam(teamToRemove)"
        @hide="teamToRemove = undefined"
      />
    </template>

    <LeagueMatchdaysDialogForm
      v-if="league"
      :visible="showGenerateGamesDialogForm"
      :league="league"
      @hide="handleGenerateGamesDialogHide"
      @matchdays:generated="getLeague"
    />

    <AlertDialog
      v-if="!!apiError"
      :visible="!!apiError"
      :message="apiError"
      severity="danger"
      :acceptLabel="t('forms.accept')"
      hideCancel
      @accepted="apiError = undefined"
      @hide="apiError = undefined"
    />
  </div>
</template>

<style scoped lang="scss">
@import 'assets/css/common/breakpoints';

.teams {
  width: 100%;
}

.league-content {
  flex: 1;
}

@media (min-width: $media-sm) {
  .teams {
    width: 250px;
  }
}
</style>

<script lang="ts">
export default {
  name: 'LeagueShow',
}
</script>
