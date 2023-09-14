import { ApiTeamResponse, ApiTeamsResponse } from '@/types/api/team'

export default class TeamService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiTeamsResponse>(`teams/fetch`, { params })
  }

  get(teamId: number, params?: Record<string, string>) {
    return useApi<ApiTeamResponse>(`teams/${teamId}`, { params })
  }
}
