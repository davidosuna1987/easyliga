import { ApiSetsResponse } from '@/types/api/set'

export default class SetService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiSetsResponse>(`sets/fetch`, { params })
  }
}
