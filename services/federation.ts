import {
  ApiFederationFormRequest,
  ApiFederationResponse,
  ApiFederationsResponse,
} from '@/types/api/federation'
import { ApiTeamResponse } from '@/types/api/team'
import { FederationScope } from '@/domain/federation'

const PREFIX = 'federations'

export default class FederationService {
  get(federationId: number, params?: Record<string, string>) {
    return useApi<ApiFederationResponse>(`${PREFIX}/${federationId}`, {
      params,
    })
  }

  fetch(params?: Record<string, string>) {
    return useApi<ApiFederationsResponse>(`${PREFIX}/fetch`, { params })
  }

  scope(scope: FederationScope, params?: Record<string, string>) {
    return useApi<ApiFederationsResponse>(`${PREFIX}/scope/${scope}`, {
      params,
    })
  }

  scopeWithLeagues(scope: FederationScope, params?: Record<string, string>) {
    return useApi<ApiFederationsResponse>(
      `${PREFIX}/scope-with-leagues/${scope}`,
      {
        params,
      },
    )
  }

  update(federationId: number, data: ApiFederationFormRequest) {
    return useApi<ApiFederationResponse>(`${PREFIX}/${federationId}`, {
      method: 'PUT',
      body: data,
    })
  }

  clubs(federationId: number, params?: Record<string, string>) {
    return useApi<ApiTeamResponse>(`${PREFIX}/${federationId}/clubs/fetch`, {
      params,
    })
  }
}
