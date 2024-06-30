import { ApiSanctionResponse } from '@/types/api/sanction'
import {
  SanctionStoreRequest,
  mapSanctionStoreRequestToApiSanctionStoreRequest,
} from '@/domain/sanction'

const PREFIX = 'sanctions'

export default class SanctionService {
  store(data: SanctionStoreRequest) {
    return useApi<ApiSanctionResponse>(`${PREFIX}`, {
      method: 'POST',
      body: mapSanctionStoreRequestToApiSanctionStoreRequest(data),
    })
  }
}
