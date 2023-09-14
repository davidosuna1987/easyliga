import { ApiClubsResponse } from '@/types/api/club'

export default class ClubService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiClubsResponse>(`clubs/fetch`, { params })
  }
}
