<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import FederationService from '@/services/federation'
import { Federation, mapApiFederationToFederation } from '@/domain/federation'
import { League } from '@/domain/league'
import { getListTagColor } from '@/domain/list'

const { t } = useI18n()
const auth = useAuthStore()
const federationService = new FederationService()

const groupedLeagues = ref<Federation[]>()
const showAddLeagueDialog = ref<number | undefined>(undefined)
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
    with: 'leagues.teams,leagues.category,leagues.gender,federations.leagues.teams,federations.leagues.category,federations.leagues.gender',
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
        <div class="mb-3" v-for="federation in groupedLeagues">
          <header class="header flex justify-between mb-1">
            <Heading tag="h6">{{ federation.name }}</Heading>
            <ListActionButton
              :label="t('leagues.add')"
              :onClick="() => (showAddLeagueDialog = federation.id)"
            />
          </header>

          <List v-if="federation.leagues?.length">
            <ListItem v-for="league in federation.leagues">
              <div class="flex items-center gap-2">
                <p>{{ league.name }}</p>
                <ListTag
                  :label="`${t(`categories.${league.category?.name}`)}`"
                  color="primary"
                />
                <ListTag
                  :label="`${t(`genders.${league.gender?.name}`)}`"
                  :color="getListTagColor(league.gender?.name)"
                />
              </div>

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
                  severity="info"
                  outlined
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
