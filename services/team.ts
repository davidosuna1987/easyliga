import { ApiTeamResponse } from '@/types/api/team'

export default class TeamService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiTeamResponse>(`teams/fetch`, { params })
  }
}
