import { ApiSanctionResponse } from '@/types/api/sanction'
import {
  SanctionStoreRequest,
  mapSanctionStoreRequestToApiSanctionStoreRequest,
} from '@/domain/sanction'

export default class SanctionService {
  store(data: SanctionStoreRequest) {
    return useApi<ApiSanctionResponse>(`sanctions`, {
      method: 'POST',
      body: mapSanctionStoreRequestToApiSanctionStoreRequest(data),
    })
  }
}
