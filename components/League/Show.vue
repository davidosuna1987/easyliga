<script setup lang="ts">
import LeagueService from '@/services/league'
import { League, mapApiLeagueToLeague } from '@/domain/league'
import { Game } from '@/domain/game'
import { Team } from '@/domain/team'
import { getListTagColor } from '@/domain/list'
import { User } from 'domain/user'

const { t } = useI18n()
const route = useRoute()
const toast = useEasyToast()
const leagueService = new LeagueService()

const league = ref<League>()
const showGenerateGamesDialogForm = ref<boolean>(false)
const showAddTeamDialogForm = ref<boolean>(false)
const showRemoveTeamAlertDialog = ref<boolean>(false)
const showRefereeSelectorDialogForm = ref<Game>()
const showGameSetPartialsDialogForm = ref<Game>()
const teamToRemove = ref<Team>()
const loadingApi = ref<boolean>(true)

const getLeague = async () => {
  loadingApi.value = true

  const { data, error } = await leagueService.get(
    Number(route.params.leagueId),
    {
      with: 'federation,division,games.referee.profile,teams.federation,teams.gender,teams.category,category,gender',
    },
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    league.value = mapApiLeagueToLeague(data.value.data.league)
  }

  loadingApi.value = false
  showGenerateGamesDialogForm.value = false
}

const orderMatchdayGamesByBye = (games: Game[]) => {
  return games.sort((a, b) => {
    if (a.isBye) return 1
    if (b.isBye) return -1
    return 0
  })
}

const handleOnRemoveTeam = async (team: Team) => {
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

const handleShowRemoveTeamAlertDialog = (team: Team) => {
  showRemoveTeamAlertDialog.value = true
  teamToRemove.value = team
}

const handleTeamAdded = (team: Team) => {
  league.value?.teams?.push(team)
  showAddTeamDialogForm.value = false
}

const handleRefereeAssigned = (referee: User) => {
  if (referee.id !== showRefereeSelectorDialogForm.value?.refereeId) {
    getLeague()
  }

  showRefereeSelectorDialogForm.value = undefined
}

const handlePartialsAssigned = () => {
  showGameSetPartialsDialogForm.value = undefined
  getLeague()
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
              v-if="!league.matchdays?.length"
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
                league.matchdays?.length
                  ? undefined
                  : () => handleShowRemoveTeamAlertDialog(team)
              "
              reverseIcons
            />
          </EasyGrid>
        </div>

        <EasyGrid v-if="league.matchdays?.length" class="matchdays" :gap="3">
          <template
            v-for="matchday in league.matchdays"
            :key="matchday.matchday"
          >
            <div v-if="matchday.matchday">
              <Heading tag="h6" class="mb-2">
                {{ t('games.matchdays.num', { num: matchday.matchday }) }}
              </Heading>
              <EasyGrid :breakpoints="{ md: 2, lg: 3, xl: 4 }" :gap="3">
                <LeagueGameCard
                  v-for="game in orderMatchdayGamesByBye(matchday.games)"
                  :key="game.id"
                  :game="game"
                  showActions
                  @referee:assign="showRefereeSelectorDialogForm = game"
                  @game:set-partials="showGameSetPartialsDialogForm = game"
                />
              </EasyGrid>
            </div>
          </template>
        </EasyGrid>

        <div
          v-else
          class="matchdays is-sticky-action is-sticky-action__sm flex flex-col items-center gap-3"
        >
          <p>{{ t('games.matchdays.not_generated') }}</p>
          <Button
            :label="t('games.matchdays.generate')"
            size="small"
            @click.prevent="handleGenerateGamesDialogShow"
          />
        </div>
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
  </div>
</template>

<style scoped lang="scss">
@import 'assets/css/common/breakpoints';

.teams {
  width: 100%;
}

.matchdays {
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
