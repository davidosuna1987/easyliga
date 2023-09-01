import { ApiSetsResponse, ApiSetStartRequest } from '@/types/api/set'

export default class SetService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiSetsResponse>(`sets/fetch`, { params })
  }

  start(setId: number, data: ApiSetStartRequest) {
    return useApi(`sets/${setId}/start`, {
      method: 'PUT',
      body: data,
    })
  }
}
