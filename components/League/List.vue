<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import FederationService from '@/services/federation'
import { Federation, mapApiFederationToFederation } from '@/domain/federation'
import { League, mapApiLeagueToLeague } from '@/domain/league'

const { t } = useI18n()
const auth = useAuthStore()
const federationService = new FederationService()

const groupedLeagues = ref<Federation[]>()
const loadingApi = ref<boolean>(false)

const teamsCount = (league: League) =>
  league.teamsCount ? league.teamsCount : league.teams?.length ?? 0

const flattenFederations = (federations: Federation[]): Federation[] => {
  const recurse = (feds: Federation[]): Federation[] => {
    return feds.flatMap(fed => {
      const { federations, ...rest } = fed

      const flattenedFederation: Federation = {
        ...rest,
      }

      const nestedFederations = federations ? recurse(federations) : []

      return [flattenedFederation, ...nestedFederations]
    })
  }

  return recurse(federations)
}

const getLeagues = async () => {
  if (!auth.user) return

  loadingApi.value = true
  const { data } = await federationService.fetch({
    where: `responsible_id:${auth.user.id}`,
    with: 'leagues.teams,federations.leagues.teams',
  })

  if (data.value) {
    groupedLeagues.value = flattenFederations(
      data.value?.data.federations.map(mapApiFederationToFederation),
    )
  }

  loadingApi.value = false
}

const goToLeague = (league: League) => {
  navigateTo(`/leagues/${league.id}`)
}

onMounted(getLeagues)
</script>

<template>
  <div class="easy-league-list-component">
    <Loading v-if="loadingApi" />
    <template v-else>
      <EasyGrid v-if="groupedLeagues?.length" :gap="5">
        <div v-for="federation in groupedLeagues">
          <Heading tag="h6">{{ federation.name }}</Heading>

          <List v-if="federation.leagues?.length">
            <ListItem v-for="league in federation.leagues">
              <p>{{ league.name }}</p>

              <template #actions>
                <ListActionLabel>
                  {{
                    t(
                      'teams.count',
                      { num: teamsCount(league) },
                      teamsCount(league),
                    )
                  }}
                </ListActionLabel>
                <ListActionButton
                  :label="t('forms.show')"
                  :onClick="() => goToLeague(league)"
                />
              </template>
            </ListItem>
          </List>

          <p v-else class="opacity-60">{{ t('leagues.list_empty') }}</p>
        </div>
      </EasyGrid>
      <p v-else class="text-center">
        {{ t('federations.no_managed') }}
      </p>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LeagueList',
}
</script>
