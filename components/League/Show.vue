<script setup lang="ts">
import LeagueService from '@/services/league'
import { League, mapApiLeagueToLeague } from '@/domain/league'
import { Team } from '@/domain/team'
import { getListTagColor } from '@/domain/list'

const { t } = useI18n()
const route = useRoute()
const toast = useEasyToast()
const leagueService = new LeagueService()

const league = ref<League>()
const showGenerateGamesDialogForm = ref<boolean>(false)
const showAddTeamDialogForm = ref<boolean>(false)
const loadingApi = ref<boolean>(true)

const getLeague = async () => {
  loadingApi.value = true

  const { data, error } = await leagueService.get(
    Number(route.params.leagueId),
    {
      with: 'federation,division,games,teams.federation,teams.gender,teams.category,category,gender',
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

const handleAddTeamDialogShow = () => {
  showAddTeamDialogForm.value = true
}

const handleTeamAdded = (team: Team) => {
  league.value?.teams?.push(team)
  showAddTeamDialogForm.value = false
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

      <div class="flex flex-col sm:flex-row gap-8">
        <div class="teams">
          <header class="flex justify-between items-center mb-2">
            <Heading tag="h6">{{ t('teams.team', 2) }}</Heading>
            <ListActionButton
              v-if="!league.matchdays?.length"
              :label="t('teams.add')"
              :onClick="handleAddTeamDialogShow"
            />
          </header>
          <EasyGrid :gap="3">
            <LeagueTeamCard
              v-for="team in league.teams"
              :team="team"
              :showCategory="team.category?.id !== league.category?.id"
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
                  v-for="game in matchday.games"
                  :key="game.id"
                  :game="game"
                />
              </EasyGrid>
            </div>
          </template>
        </EasyGrid>

        <div v-else class="matchdays flex flex-col items-center gap-3">
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
