import { ApiTeamResponse, ApiTeamsResponse } from '@/types/api/team'
import { Team, mapTeamToApiTeamRequest } from '@/domain/team'

export default class TeamService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiTeamsResponse>(`teams/fetch`, { params })
  }

  get(teamId: number, params?: Record<string, string>) {
    return useApi<ApiTeamResponse>(`teams/${teamId}`, { params })
  }

  store(data: Team, params?: Record<string, string>) {
    return useApi<ApiTeamResponse>(`teams`, {
      method: 'POST',
      body: mapTeamToApiTeamRequest(data),
      params,
    })
  }

  update(teamId: number, data: Team, params?: Record<string, string>) {
    return useApi<ApiTeamResponse>(`teams/${teamId}`, {
      method: 'PUT',
      body: mapTeamToApiTeamRequest(data),
      params,
    })
  }
}
