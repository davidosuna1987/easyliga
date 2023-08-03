import { ApiCourtResponse } from '@/types/api/court'

export default class CourtService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiCourtResponse>(`courts/fetch`, { params })
  }
}
