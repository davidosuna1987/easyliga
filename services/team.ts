import { ApiTeamResponse, ApiTeamsResponse } from '@/types/api/team'
import { Team, mapTeamToApiTeamRequest } from '@/domain/team'
import { ApiPlayerRequest } from '@/types/api/player'

const PREFIX = 'teams'

export default class TeamService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiTeamsResponse>(`${PREFIX}/fetch`, { params })
  }

  get(teamId: number, params?: Record<string, string>) {
    return useApi<ApiTeamResponse>(`${PREFIX}/${teamId}`, { params })
  }

  store(data: Team) {
    return useApi<ApiTeamResponse>(`${PREFIX}`, {
      method: 'POST',
      body: mapTeamToApiTeamRequest(data),
    })
  }

  update(teamId: number, data: Team) {
    return useApi<ApiTeamResponse>(`${PREFIX}/${teamId}`, {
      method: 'PUT',
      body: mapTeamToApiTeamRequest(data),
    })
  }

  players(params?: Record<string, string>) {
    return useApi<ApiTeamsResponse>(`${PREFIX}/players`, { params })
  }

  lowerCategoryTeamsWithPlayers(
    teamId: number,
    params?: Record<string, string>,
  ) {
    return useApi<ApiTeamsResponse>(
      `${PREFIX}/${teamId}/lower-category-teams-with-players`,
      { params },
    )
  }

  addPlayer(teamId: number, data: ApiPlayerRequest) {
    return useApi<ApiTeamResponse>(`${PREFIX}/${teamId}/players`, {
      method: 'POST',
      body: data,
    })
  }
}
