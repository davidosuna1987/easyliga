import {
  ApiCreateMatchdaysGamesRequest,
  ApiCreateMatchdaysGamesResponse,
  ApiLeagueFormRequest,
  ApiLeagueResponse,
  ApiLeagueAddTeamResponse,
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
    return useApi<ApiLeagueAddTeamResponse>(`${PREFIX}/${leagueId}/add-team`, {
      method: 'POST',
      body: data,
    })
  }
}
