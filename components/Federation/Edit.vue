<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import FederationService from '@/services/federation'
import { Federation, mapApiFederationToFederation } from '@/domain/federation'

const { t } = useI18n()
const auth = useAuthStore()
const route = useRoute()
const toast = useEasyToast()
const federationService = new FederationService()

const federation = ref<Federation>()
const loadingApi = ref<boolean>(false)

const getFederation = async () => {
  loadingApi.value = true

  const { data, error } = await federationService.get(
    Number(route.params.federationId),
    {
      with: 'federation,federations.clubs.teams,leagues,clubs.teams,responsible.profile,address,licenses',
    },
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    const federationMapped = mapApiFederationToFederation(
      data.value.data.federation,
    )
    if (!authUserCanUpdateFederation(federationMapped)) {
      toast.error(t('errors.not_allowed_to_manage_federation'))
      navigateTo('/')
    } else {
      federation.value = federationMapped
    }
  }

  loadingApi.value = false
}

const authUserCanUpdateFederation = (federation: Federation) => {
  if (!auth.user) return false

  if (auth.hasAnyRole(['admin', 'staff'])) return true

  return (
    federation.responsibleId === auth.user.id ||
    federation.federation?.responsibleId === auth.user.id
  )
}

onMounted(getFederation)
</script>

<template>
  <div class="easy-federation-edit-component">
    <Loading v-if="loadingApi" />
    <template v-else-if="federation">
      <Heading tag="h3" class="mb-5">
        {{ t('federations.edit') }}
      </Heading>
      <FederationForm
        :federation="federation"
        @refresh="getFederation"
        @updated="getFederation"
      />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FederationEdit',
}
</script>
