import { ApiLeagueResponse } from '@/types/api/league'

const PREFIX = 'leagues'

export default class LeaguesService {
  get(leagueId: number, params?: Record<string, string>) {
    return useApi<ApiLeagueResponse>(`${PREFIX}/${leagueId}`, { params })
  }
}
