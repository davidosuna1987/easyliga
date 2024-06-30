import { ApiFederationResponse } from '@/types/api/federation'
import { ApiTeamResponse } from '@/types/api/team'
import { FederationScope } from '@/domain/federation'

const PREFIX = 'federations'

export default class FederationService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiFederationResponse>(`${PREFIX}/fetch`, { params })
  }

  scope(scope: FederationScope, params?: Record<string, string>) {
    return useApi<ApiFederationResponse>(`${PREFIX}/scope/${scope}`, {
      params,
    })
  }

  scopeWithLeagues(scope: FederationScope, params?: Record<string, string>) {
    return useApi<ApiFederationResponse>(
      `${PREFIX}/scope-with-leagues/${scope}`,
      {
        params,
      },
    )
  }

  clubs(federationId: number, params?: Record<string, string>) {
    return useApi<ApiTeamResponse>(`${PREFIX}/${federationId}/clubs/fetch`, {
      params,
    })
  }
}
