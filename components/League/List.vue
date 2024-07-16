<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import FederationService from '@/services/federation'
import { Federation, mapApiFederationToFederation } from '@/domain/federation'
import { League } from '@/domain/league'

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
        <div v-for="federation in groupedLeagues">
          <Heading tag="h6">{{ federation.name }}</Heading>

          <List v-if="federation.leagues?.length">
            <ListItem v-for="league in federation.leagues">
              <div class="flex items-center gap-2">
                <p>{{ league.name }}</p>
                <Tag
                  class="font-light border-solid border-primary text-primary bg-transparent border py-[2px] px-2 dark:border-teal-500 dark:text-teal-500"
                  :value="`${t(`categories.${league.category?.name}`)}`"
                  rounded
                />
                <Tag
                  :class="[
                    'font-light border-solid border-primary bg-transparent text-primary border py-[2px] px-2',
                    {
                      'dark:border-blue-500 dark:text-blue-500':
                        league.gender?.name === 'masculine',
                      'dark:border-fuchsia-400 dark:text-fuchsia-400':
                        league.gender?.name === 'femenine',
                      'dark:border-yellow-500 dark:text-yellow-500':
                        league.gender?.name === 'mixed',
                    },
                  ]"
                  :value="`${t(`genders.${league.gender?.name}`)}`"
                  rounded
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
