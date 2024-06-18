import { ApiTeamResponse, ApiTeamsResponse } from '@/types/api/team'
import { Team, mapTeamToApiTeamRequest } from '@/domain/team'
import { ApiPlayerRequest } from '@/types/api/player'

export default class TeamService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiTeamsResponse>(`teams/fetch`, { params })
  }

  get(teamId: number, params?: Record<string, string>) {
    return useApi<ApiTeamResponse>(`teams/${teamId}`, { params })
  }

  store(data: Team) {
    return useApi<ApiTeamResponse>(`teams`, {
      method: 'POST',
      body: mapTeamToApiTeamRequest(data),
    })
  }

  update(teamId: number, data: Team) {
    return useApi<ApiTeamResponse>(`teams/${teamId}`, {
      method: 'PUT',
      body: mapTeamToApiTeamRequest(data),
    })
  }

  addPlayer(teamId: number, data: ApiPlayerRequest) {
    return useApi<ApiTeamResponse>(`teams/${teamId}/players`, {
      method: 'POST',
      body: data,
    })
  }
}
