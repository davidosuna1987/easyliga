import { ApiCourtResponse } from '@/types/api/court'

const PREFIX = 'courts'

export default class CourtService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiCourtResponse>(`${PREFIX}/fetch`, { params })
  }
}
