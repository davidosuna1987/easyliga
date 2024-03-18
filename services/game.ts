import {
  ApiGameTeamPlayersResponse,
  ApiGameInitialDataResponse,
  ApiGameResponse,
  ApiGamesResponse,
  ApiGameStoreRequest,
  ApiGameTeamIncompleteResponse,
} from '@/types/api/game'

import {
  GameObservationsRequest,
  mapGameObservationsRequestToApiGameObservationsRequest,
} from '@/domain/game'
import { SanctionSeverityKey, SanctionTypeKey } from '@/domain/sanction'

const GAMES_API_PREFIX = 'games'

export default class GameService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiGamesResponse>(`${GAMES_API_PREFIX}/fetch`, { params })
  }

  get(gameId: number, params?: Record<string, string>) {
    return useApi<ApiGameResponse>(`${GAMES_API_PREFIX}/${gameId}`, { params })
  }

  store(data: ApiGameStoreRequest) {
    return useApi<ApiGameResponse>(`${GAMES_API_PREFIX}`, {
      method: 'POST',
      body: data,
    })
  }

  initialData(gameId: number, params?: Record<string, string>) {
    return useApi<ApiGameInitialDataResponse>(
      `${GAMES_API_PREFIX}/${gameId}/initial-data`,
      {
        params,
      },
    )
  }

  teamPlayers(gameId: number, teamId: number, params?: Record<string, string>) {
    return useApi<ApiGameTeamPlayersResponse>(
      `${GAMES_API_PREFIX}/${gameId}/teams/${teamId}/players`,
      {
        params,
      },
    )
  }

  observations(gameId: number, data: GameObservationsRequest) {
    return useApi<ApiGameResponse>(
      `${GAMES_API_PREFIX}/${gameId}/observations`,
      {
        method: 'PUT',
        body: mapGameObservationsRequestToApiGameObservationsRequest(data),
      },
    )
  }

  teamIncomplete(
    gameId: number,
    teamId: number,
    params?: {
      type: Omit<SanctionTypeKey, 'team'>
      severity: Omit<SanctionSeverityKey, 'warning' | 'point'>
      player_profile_id: number
    },
  ) {
    return useApi<ApiGameTeamIncompleteResponse>(
      `${GAMES_API_PREFIX}/${gameId}/teams/${teamId}/incomplete`,
      { params },
    )
  }
}
