<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import FederationService from '@/services/federation'
import {
  Federation,
  mapApiFederationToFederation,
  flattenFederations,
} from '@/domain/federation'
import { User } from '@/domain/user'
import { getFullName } from '@/domain/player'

const { t } = useI18n()
const auth = useAuthStore()
const federationService = new FederationService()

const groupedReferees = ref<Federation[]>()
const loadingApi = ref<boolean>(false)

// const flattenFederations = (federations: Federation[]): Federation[] => {
//   const watcher = new Set<number>()

//   const recurse = (feds: Federation[]): Federation[] => {
//     return feds.flatMap(fed => {
//       const { federations, ...rest } = fed

//       const federationId = rest.id
//       if (watcher.has(federationId)) return []
//       watcher.add(federationId)

//       const flattenedFederation: Federation = {
//         ...rest,
//       }

//       const nestedFederations = federations ? recurse(federations) : []

//       return [flattenedFederation, ...nestedFederations]
//     })
//   }

//   return recurse(federations)
// }

const getReferees = async () => {
  if (!auth.user) return

  loadingApi.value = true
  const { data } = await federationService.fetch({
    where: `responsible_id:${auth.user.id}`,
    with: 'referees.profile,federations.referees.profile',
  })

  if (data.value) {
    groupedReferees.value = flattenFederations(
      data.value?.data.federations.map(mapApiFederationToFederation),
    )
  }

  loadingApi.value = false
}

const handleAddReferee = (federation: Federation) => {
  // navigateTo(`/federation/${federation.id}/referee/create`)
}

const goToReferee = (referee: User) => {
  // navigateTo(`/referee/${referee.id}`)
}

const goToEditReferee = (referee: User) => {
  // navigateTo(`/federation/${referee.federationId}/referee/${referee.id}/edit`)
}

const setRefereeToRemove = (federationId: number, profileId: number) => {
  const federation = groupedReferees.value?.find(fed => fed.id === federationId)

  const referee = federation?.referees?.find(
    ref => ref.profile?.id === profileId,
  )

  if (!federation || !referee) return

  console.log({ federation, referee })
}

onMounted(getReferees)
</script>

<template>
  <div class="easy-referee-list-component">
    <Loading v-if="loadingApi" />
    <template v-else>
      <EasyGrid v-if="groupedReferees?.length" :gap="5">
        <div class="mb-3" v-for="federation in groupedReferees">
          <header class="header grid grid-cols-[1fr_auto] items-start mb-1">
            <Heading tag="h6">{{ federation.name }}</Heading>
            <ListActionButton
              class="mt-1"
              :label="t('referees.add')"
              :onClick="() => handleAddReferee(federation)"
            />
          </header>

          <EasyGrid
            v-if="federation.referees?.length"
            class="federatoin-referees-list"
            :breakpoints="{ sm: 2, lg: 3, xl: 4 }"
            :gap="3"
          >
            <template v-for="referee in federation.referees">
              <ProfileItem
                v-if="referee.profile"
                :profile="referee.profile"
                :onRemove="() => {}"
                :removeTooltip="t('referees.delete')"
                :tag="referee.pivot?.admin ? 'admin' : undefined"
              />
              <!-- :onRemove="profileId => setRefereeToRemove(federation.id, profileId)" -->
            </template>
          </EasyGrid>

          <p v-else class="opacity-60">
            {{ t('federations.referee_list_empty') }}
          </p>
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
  name: 'RefereeList',
}
</script>
