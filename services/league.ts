import {
  ApiCreateMatchdaysGamesRequest,
  ApiCreateMatchdaysGamesResponse,
  ApiLeagueResponse,
} from '@/types/api/league'

const PREFIX = 'leagues'

export default class LeaguesService {
  get(leagueId: number, params?: Record<string, string>) {
    return useApi<ApiLeagueResponse>(`${PREFIX}/${leagueId}`, { params })
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
}
