import {
  ApiCreateMatchdaysGamesRequest,
  ApiCreateMatchdaysGamesResponse,
  ApiLeagueFormRequest,
  ApiLeagueResponse,
  ApiLeagueTeamFormResponse,
  ApiLeagueAddTeamFormRequest,
  ApiLeaguesResponse,
} from '@/types/api/league'
import {
  ApiLeagueShowGameResponse,
  ApiLeagueShowMatchdayGamesResponse,
  ApiLeagueShowResponse,
} from '@/types/api/league-show'

const PREFIX = 'leagues'

export default class LeagueService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiLeaguesResponse>(`${PREFIX}/fetch`, { params })
  }

  get(leagueId: number, params?: Record<string, string>) {
    return useApi<ApiLeagueResponse>(`${PREFIX}/${leagueId}`, { params })
  }

  show(leagueId: number) {
    return useApi<ApiLeagueShowResponse>(`${PREFIX}/${leagueId}/show`)
  }

  showMatchdayGames(leagueId: number, matchday: string | number) {
    return useApi<ApiLeagueShowMatchdayGamesResponse>(
      `${PREFIX}/${leagueId}/show/matchday/${matchday}/games`,
    )
  }

  showGame(leagueId: number, gameId: number) {
    return useApi<ApiLeagueShowGameResponse>(
      `${PREFIX}/${leagueId}/show/games/${gameId}`,
    )
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
