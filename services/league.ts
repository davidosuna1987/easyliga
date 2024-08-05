import {
  ApiCreateMatchdaysGamesRequest,
  ApiCreateMatchdaysGamesResponse,
  ApiLeagueFormRequest,
  ApiLeagueResponse,
  ApiLeagueTeamFormResponse,
  ApiLeagueAddTeamFormRequest,
} from '@/types/api/league'

const PREFIX = 'leagues'

export default class LeaguesService {
  get(leagueId: number, params?: Record<string, string>) {
    return useApi<ApiLeagueResponse>(`${PREFIX}/${leagueId}`, { params })
  }

  store(data: ApiLeagueFormRequest) {
    return useApi<ApiLeagueResponse>(`${PREFIX}`, {
      method: 'POST',
      body: data,
    })
  }

  update(leagueId: number, data: ApiLeagueFormRequest) {
    return useApi<ApiLeagueResponse>(`${PREFIX}/${leagueId}`, {
      method: 'PUT',
      body: data,
    })
  }

  createMatchdaysGames(leagueId: number, data: ApiCreateMatchdaysGamesRequest) {
    return useApi<ApiCreateMatchdaysGamesResponse>(
      `${PREFIX}/${leagueId}/create-matchdays-games`,
      {
        method: 'POST',
        body: data,
      },
    )
  }

  addTeam(leagueId: number, data: ApiLeagueAddTeamFormRequest) {
    return useApi<ApiLeagueTeamFormResponse>(`${PREFIX}/${leagueId}/add-team`, {
      method: 'POST',
      body: data,
    })
  }

  removeTeam(leagueId: number, teamId: number) {
    return useApi<ApiLeagueTeamFormResponse>(
      `${PREFIX}/${leagueId}/remove-team`,
      {
        method: 'DELETE',
        body: { team_id: teamId },
      },
    )
  }
}
