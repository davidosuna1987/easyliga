import { ApiInjuryResponse, ApiInjuriesResponse } from '@/types/api/injury'
import {
  InjuryFormRequest,
  mapInjuryFormRequestToApiInjuryRequest,
} from '@/domain/injury'

const PREFIX = 'injuries'

export default class Injurieservice {
  fetch(params?: Record<string, string>) {
    return useApi<ApiInjuriesResponse>(`${PREFIX}/fetch`, { params })
  }

  get(injuryId: number, params?: Record<string, string>) {
    return useApi<ApiInjuryResponse>(`${PREFIX}/${injuryId}`, { params })
  }

  store(data: InjuryFormRequest) {
    return useApi<ApiInjuryResponse>(`${PREFIX}`, {
      method: 'POST',
      body: mapInjuryFormRequestToApiInjuryRequest(data),
    })
  }
}
