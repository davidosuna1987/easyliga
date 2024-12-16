<script setup lang="ts">
import LeagueService from '@/services/league'
import { League, mapApiLeagueToLeague } from '@/domain/league'

const props = defineProps({
  selectedLeague: {
    type: Object as PropType<League>,
    required: false,
    default: undefined,
  },
})

const { t } = useI18n()

const leagueService = new LeagueService()

const loadingApi = ref<boolean>(false)

const selectedLeagueLastMatchday = computed(() => {
  if (!props.selectedLeague?.lastMatchdayGames) return
  return {
    matchday: props.selectedLeague.lastMatchdayGames[0].matchday,
    games: props.selectedLeague.lastMatchdayGames,
  }
})

const selectedLeagueNextMatchday = computed(() => {
  if (!props.selectedLeague?.nextMatchdayGames) return
  return {
    matchday: props.selectedLeague.nextMatchdayGames[0].matchday,
    games: props.selectedLeague.nextMatchdayGames,
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
  if (!props.selectedLeague || props.selectedLeague.classification) return

  loadingApi.value = true

  const { data } = await leagueService.get(props.selectedLeague.id, {
    with: 'category,gender,lastMatchdayGames,nextMatchdayGames',
    set_appends: 'classification',
  })

  if (data.value) {
    const league = mapApiLeagueToLeague(data.value.data.league)
    props.selectedLeague.gender = league.gender
    props.selectedLeague.category = league.category
    props.selectedLeague.classification = league.classification
    props.selectedLeague.lastMatchdayGames = league.lastMatchdayGames
    props.selectedLeague.nextMatchdayGames = league.nextMatchdayGames
  }

  loadingApi.value = false
}

watch(() => props.selectedLeague, getLeagueClassification, { immediate: true })
</script>

<template>
  <EasyGrid :gap="8" class="easy-web-classification-component">
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
