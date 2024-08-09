import {
  ApiFederationFormRequest,
  ApiFederationResponse,
  ApiFederationsResponse,
} from '@/types/api/federation'
import { FederationScope } from '@/domain/federation'
import { ApiUsersResponse } from 'types/api/user'
import { ApiClubsResponse } from 'types/api/club'

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
    return useApi<ApiClubsResponse>(`${PREFIX}/${federationId}/clubs/fetch`, {
      params,
    })
  }

  referees(federationId: number, params?: Record<string, string>) {
    return useApi<ApiUsersResponse>(
      `${PREFIX}/${federationId}/referees/fetch`,
      {
        params,
      },
    )
  }
}
