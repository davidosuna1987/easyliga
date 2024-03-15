import { ApiFederationResponse } from '@/types/api/federation'
import { ApiTeamResponse } from '@/types/api/team'
import { FederationScope } from '@/domain/federation'

export default class FederationService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiFederationResponse>(`federations/fetch`, { params })
  }

  scope(scope: FederationScope, params?: Record<string, string>) {
    return useApi<ApiFederationResponse>(`federations/scope/${scope}`, {
      params,
    })
  }

  scopeWithLeagues(scope: FederationScope, params?: Record<string, string>) {
    return useApi<ApiFederationResponse>(
      `federations/scope-with-leagues/${scope}`,
      {
        params,
      },
    )
  }

  clubs(federationId: number, params?: Record<string, string>) {
    return useApi<ApiTeamResponse>(`federations/${federationId}/clubs/fetch`, {
      params,
    })
  }
}
