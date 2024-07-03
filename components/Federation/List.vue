<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import FederationService from '@/services/federation'
import { Federation, mapApiFederationToFederation } from '@/domain/federation'

const { t } = useI18n()
const auth = useAuthStore()
const federationService = new FederationService()

const federations = ref<Federation[]>()
const loadingApi = ref<boolean>(false)

const federationsCount = (federation: Federation) => {
  return (
    federation.federations?.reduce(
      (acc: number, f: Federation) => acc + (f.federations?.length ?? 0),
      federation.federations.length ?? 0,
    ) ?? 0
  )
}

const leaguesCount = (federation: Federation) => {
  return (
    federation.federations?.reduce(
      (acc: number, f: Federation) => acc + (f.leagues?.length ?? 0),
      federation.leaguesCount ?? 0,
    ) ?? 0
  )
}

const clubsCount = (federation: Federation) => {
  return (
    federation.federations?.reduce(
      (acc: number, f: Federation) => acc + (f.clubs?.length ?? 0),
      federation.clubsCount ?? 0,
    ) ?? 0
  )
}

const getFederations = async () => {
  if (!auth.user) return

  loadingApi.value = true
  const { data } = await federationService.fetch({
    where: `responsible_id:${auth.user.id}`,
    with: 'federations.leagues,federations.clubs',
    with_count: 'leagues,clubs',
  })

  federations.value = data.value?.data.federations.map(
    mapApiFederationToFederation,
  )

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
        <ListItem v-for="federation in federations">
          <p>{{ federation.name }}</p>

          <template #actions>
            <ListActionLabel v-if="federation.federations?.length">
              {{
                t(
                  'federations.count',
                  { num: federationsCount(federation) },
                  federationsCount(federation),
                )
              }}
            </ListActionLabel>
            <ListActionLabel>
              {{
                t(
                  'clubs.count',
                  { num: clubsCount(federation) },
                  clubsCount(federation),
                )
              }}
            </ListActionLabel>
            <ListActionLabel>
              {{
                t(
                  'leagues.count',
                  { num: leaguesCount(federation) },
                  leaguesCount(federation),
                )
              }}
            </ListActionLabel>
            <ListActionButton
              :label="t('forms.edit')"
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
