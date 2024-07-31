<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import FederationService from '@/services/federation'
import { Federation, mapApiFederationToFederation } from '@/domain/federation'

const { t } = useI18n()
const auth = useAuthStore()
const federationService = new FederationService()

const federations = ref<Federation[]>()
const loadingApi = ref<boolean>(false)

const leaguesCount = (federation: Federation) => {
  return (
    (federation.federations ?? []).reduce(
      (acc: number, f: Federation) => acc + (f.leagues?.length ?? 0),
      federation.leaguesCount
        ? federation.leaguesCount
        : federation.leagues?.length ?? 0,
    ) ?? 0
  )
}

const clubsCount = (federation: Federation) => {
  return (
    (federation.federations ?? []).reduce(
      (acc: number, f: Federation) => acc + (f.clubs?.length ?? 0),
      federation.clubsCount
        ? federation.clubsCount
        : federation.clubs?.length ?? 0,
    ) ?? 0
  )
}

const flattenFederations = (federations: Federation[]): Federation[] => {
  const recurse = (feds: Federation[], hierarchy: number): Federation[] => {
    return feds.flatMap(fed => {
      const {
        federations,
        leagues,
        clubs,
        leaguesCount: lc,
        clubsCount: cc,
        ...rest
      } = fed

      const flattenedFederation: Federation = {
        ...rest,
        hierarchy,
        leaguesCount: leaguesCount(fed),
        clubsCount: clubsCount(fed),
      }

      const nestedFederations = federations
        ? recurse(federations, hierarchy + 1)
        : []

      return [flattenedFederation, ...nestedFederations]
    })
  }

  return recurse(federations, 1)
}

const getFederations = async () => {
  if (!auth.user) return

  loadingApi.value = true
  const { data } = await federationService.fetch({
    where: `responsible_id:${auth.user.id}`,
    with: 'federations.leagues,federations.clubs',
    with_count: 'leagues,clubs',
  })

  if (data.value) {
    federations.value = flattenFederations(
      data.value?.data.federations.map(mapApiFederationToFederation),
    )
  }

  loadingApi.value = false
}

const goToEditFederation = (federation: Federation) => {
  navigateTo(`/federations/${federation.id}/edit`)
}

onMounted(getFederations)
</script>

<template>
  <div class="easy-federation-list-component">
    <Loading v-if="loadingApi" />
    <template v-else>
      <List v-if="federations?.length">
        <ListItem
          v-for="federation in federations"
          :hierarchy="federation.hierarchy"
        >
          <p>{{ federation.name }}</p>

          <template #actions>
            <ListActionLabel>
              {{
                t(
                  'clubs.count',
                  { num: federation.clubsCount },
                  federation.clubsCount ?? 0,
                )
              }}
            </ListActionLabel>
            <ListActionLabel>
              {{
                t(
                  'leagues.count',
                  { num: federation.leaguesCount },
                  federation.leaguesCount ?? 0,
                )
              }}
            </ListActionLabel>
            <ListActionButton
              :label="t('forms.edit')"
              severity="info"
              outlined
              :onClick="() => goToEditFederation(federation)"
            />
          </template>
        </ListItem>
      </List>
      <p v-else class="text-center">
        {{ t('federations.no_managed') }}
      </p>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FederationList',
}
</script>
