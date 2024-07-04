<script lang="ts" setup>
import { Federation, mapApiFederationToFederation } from '@/domain/federation'
import FederationService from '@/services/federation'
import { Club } from '@/domain/club'

const { t } = useI18n()
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
      with: 'federations.clubs.teams,leagues,clubs.teams,responsible.profile,address,licenses',
    },
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    federation.value = mapApiFederationToFederation(data.value.data.federation)
  }

  loadingApi.value = false
}

const setInitialFederation = async () => {
  await getFederation()
}

onMounted(setInitialFederation)
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
        @refresh="setInitialFederation"
        @updated="setInitialFederation"
      />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FederationEdit',
}
</script>
