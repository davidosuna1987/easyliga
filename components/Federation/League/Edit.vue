<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import LeagueService from '@/services/league'
import { League, mapApiLeagueToLeague } from '@/domain/league'

const { t } = useI18n()
const auth = useAuthStore()
const route = useRoute()
const toast = useEasyToast()
const leagueService = new LeagueService()

const league = ref<League>()
const loadingApi = ref<boolean>(false)

const getLeague = async () => {
  loadingApi.value = true

  const { data, error } = await leagueService.get(
    Number(route.params.leagueId),
    {
      with: 'federation.divisions,federation.federation.divisions,division,category,gender',
    },
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    const leagueMapped = mapApiLeagueToLeague(data.value.data.league)
    if (!authUserCanUpdateLeague(leagueMapped)) {
      toast.error(t('errors.not_allowed_to_manage_league'))
      navigateTo('/')
    } else {
      league.value = leagueMapped
    }
  }

  loadingApi.value = false
}

const authUserCanUpdateLeague = (league: League) => {
  if (!auth.user) return false

  if (auth.hasAnyRole(['admin', 'staff'])) return true

  return (
    league.federation?.responsibleId === auth.user.id ||
    league.federation?.federation?.responsibleId === auth.user.id
  )
}

const handleLeagueUpdated = (league: League) =>
  navigateTo(`/league/${league.id}`)

onMounted(getLeague)
</script>

<template>
  <div class="easy-federation-league-edit-component">
    <Loading v-if="loadingApi" />
    <template v-else-if="league && league.federation">
      <Heading tag="h3" class="mb-5">{{ t('leagues.edit') }}</Heading>

      <LeagueForm
        :league="league"
        :federation="league.federation"
        @league:updated="handleLeagueUpdated"
      />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FederationLeagueEdit',
}
</script>
