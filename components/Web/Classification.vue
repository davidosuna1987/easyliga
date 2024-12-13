<script setup lang="ts">
import LeagueService from '@/services/league'
import { League, mapApiLeagueToLeague } from '@/domain/league'

const { t } = useI18n()

const leagueService = new LeagueService()

const selectedLeague = ref<League>()

const loadingApi = ref<boolean>(false)

const selectedLeagueLastMatchday = computed(() => {
  if (!selectedLeague.value?.lastMatchdayGames) return
  return {
    matchday: selectedLeague.value.lastMatchdayGames[0].matchday,
    games: selectedLeague.value.lastMatchdayGames,
  }
})

const selectedLeagueNextMatchday = computed(() => {
  if (!selectedLeague.value?.nextMatchdayGames) return
  return {
    matchday: selectedLeague.value.nextMatchdayGames[0].matchday,
    games: selectedLeague.value.nextMatchdayGames,
  }
})

const lastMatchdayHeader = computed(
  () =>
    `${t('leagues.last_matchday')}: ${t('games.matchdays.num', {
      num: selectedLeagueLastMatchday.value?.matchday ?? 0,
    }).toLocaleLowerCase()}`,
)

const nextMatchdayHeader = computed(
  () =>
    `${t('leagues.next_matchday')}: ${t('games.matchdays.num', {
      num: selectedLeagueNextMatchday.value?.matchday ?? 0,
    }).toLocaleLowerCase()}`,
)

const getLeagueClassification = async () => {
  if (!selectedLeague.value || selectedLeague.value.classification) return

  loadingApi.value = true

  const { data } = await leagueService.get(selectedLeague.value.id, {
    with: 'category,gender,lastMatchdayGames,nextMatchdayGames',
    set_appends: 'classification',
  })

  if (data.value) {
    const league = mapApiLeagueToLeague(data.value.data.league)
    selectedLeague.value.gender = league.gender
    selectedLeague.value.category = league.category
    selectedLeague.value.classification = league.classification
    selectedLeague.value.lastMatchdayGames = league.lastMatchdayGames
    selectedLeague.value.nextMatchdayGames = league.nextMatchdayGames
  }

  loadingApi.value = false
}

const setSelectedLeague = (league?: League) => {
  selectedLeague.value = league

  if (league) {
    getLeagueClassification()
  }
}
</script>

<template>
  <EasyGrid :gap="8" class="easy-web-classification-component">
    <WebLeagueSelector @league:selected="setSelectedLeague" />

    <LoadingLabel v-if="loadingApi" :label="t('leagues.loading')" center />
    <template v-else-if="selectedLeague">
      <LeagueTitle :league="selectedLeague" />
      <LeagueMatchday
        v-if="selectedLeagueLastMatchday"
        :matchday="selectedLeagueLastMatchday"
        :header="lastMatchdayHeader"
      />
      <LeagueMatchday
        v-if="selectedLeagueNextMatchday"
        :matchday="selectedLeagueNextMatchday"
        :header="nextMatchdayHeader"
      />
      <template v-if="selectedLeague?.classification">
        <Heading tag="h6" class="mb-2">
          {{ `${t('leagues.classification')} ${selectedLeague.nameLong}` }}
        </Heading>
        <LeagueClassificationTable
          :classification="selectedLeague.classification"
        />
      </template>
    </template>
  </EasyGrid>
</template>

<script lang="ts">
export default {
  name: 'WebClassification',
}
</script>
