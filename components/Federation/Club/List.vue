<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import FederationService from '@/services/federation'
import { Federation, mapApiFederationToFederation } from '@/domain/federation'

const { t } = useI18n()
const auth = useAuthStore()
const federationService = new FederationService()

const federations = ref<Federation[]>()
const loadingApi = ref<boolean>(false)

const getFederations = async () => {
  if (!auth.user) return

  loadingApi.value = true
  const { data } = await federationService.fetch({
    where: `responsible_id:${auth.user.id}`,
    with: 'clubs.teams,federations.clubs.teams',
  })

  if (data.value) {
    federations.value = data.value?.data.federations.map(
      mapApiFederationToFederation,
    )
  }

  loadingApi.value = false
}

onMounted(getFederations)
</script>

<template>
  <div class="easy-federation-club-list-component">
    <Loading v-if="loadingApi" />
    <template v-else>
      <template v-if="federations?.length">
        <FederationClubs
          v-for="federation in federations"
          :key="federation.id"
          :federation="federation"
        />
      </template>

      <div v-else class="flex flex-col items-center text-center">
        <p>{{ t('federations.no_clubs') }}</p>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FederationClubList',
}
</script>
