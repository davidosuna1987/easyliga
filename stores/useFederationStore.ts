import { defineStore } from 'pinia'
import { ApiFederation } from '@/types/api/federation'
import FederationService from '@/services/federation'
import { FEDERATION_SCOPE_MAPPER } from '@/domain/federation'

const federationService = new FederationService()

export const useFederationStore = defineStore('federations', () => {
  const federations = ref<ApiFederation[]>([])
  const nationalFederations = ref<ApiFederation[]>([])
  const groupedFederations = ref<ApiFederation[]>([])

  const fetch = async (params?: Record<string, string>) => {
    const response = await federationService.fetch(params)

    federations.value = response.data.value?.data.federations ?? []
    nationalFederations.value = getNationalFederations(federations.value)
    groupedFederations.value = groupFederationsById(federations.value)

    return response
  }

  const getNationalFederations = (
    federations: ApiFederation[],
  ): ApiFederation[] =>
    federations.filter(
      federation => federation.scope === FEDERATION_SCOPE_MAPPER.national,
    )

  const groupFederationsById = (
    federations: ApiFederation[],
  ): ApiFederation[] => {
    return federations.reduce<ApiFederation[]>((acc, obj) => {
      const parent = acc.find(item => item.id === obj.federation_id)

      if (parent) {
        if (!parent.federations) {
          parent.federations = []
        }

        parent.federations.push(obj)
      } else {
        acc.push({
          ...obj,
          federations: [],
        })
      }

      return acc
    }, [])
  }

  return {
    federations,
    nationalFederations,
    groupedFederations,
    fetch,
    groupFederationsById,
  }
})
