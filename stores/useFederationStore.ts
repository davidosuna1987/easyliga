import { defineStore } from 'pinia'
import { ApiFederation, ApiFederationResponse } from '@/types/api/federation'

export const useFederationStore = defineStore('federations', () => {
  const federations = ref<ApiFederation[]>([])

  const fetch = async () => {
    const response = await useApi<ApiFederationResponse>('federations/fetch', {
      method: 'GET',
    })

    federations.value = response.data.value?.data.federations ?? []

    return response
  }

  return {
    federations,
    fetch,
  }
})
