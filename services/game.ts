import {
  ApiGameTeamPlayersResponse,
  ApiGameInitialDataResponse,
  ApiGameResponse,
  ApiGamesResponse,
  ApiGameStoreRequest,
  ApiGameTeamIncompleteResponse,
  ApiGameReportSimpleResponse,
  ApiGameRequestChangeDateRequest,
} from '@/types/api/game'

import {
  GameObservationsRequest,
  mapGameObservationsRequestToApiGameObservationsRequest,
} from '@/domain/game'
import { SanctionSeverityKey, SanctionTypeKey } from '@/domain/sanction'

const PREFIX = 'games'

export default class GameService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiGamesResponse>(`${PREFIX}/fetch`, { params })
  }

  get(gameId: number, params?: Record<string, string>) {
    return useApi<ApiGameResponse>(`${PREFIX}/${gameId}`, { params })
  }

  store(data: ApiGameStoreRequest) {
    return useApi<ApiGameResponse>(`${PREFIX}`, {
      method: 'POST',
      body: data,
    })
  }

  initialData(gameId: number, params?: Record<string, string>) {
    return useApi<ApiGameInitialDataResponse>(
      `${PREFIX}/${gameId}/initial-data`,
      {
        params,
      },
    )
  }

  teamPlayers(gameId: number, teamId: number, params?: Record<string, string>) {
    return useApi<ApiGameTeamPlayersResponse>(
      `${PREFIX}/${gameId}/teams/${teamId}/players`,
      {
        params,
      },
    )
  }

  observations(gameId: number, data: GameObservationsRequest) {
    return useApi<ApiGameResponse>(`${PREFIX}/${gameId}/observations`, {
      method: 'PUT',
      body: mapGameObservationsRequestToApiGameObservationsRequest(data),
    })
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
      `${PREFIX}/${gameId}/teams/${teamId}/incomplete`,
      { params },
    )
  }

  reportSimple(gameId: number) {
    return useApi<ApiGameReportSimpleResponse>(
      `${PREFIX}/${gameId}/report/simple`,
    )
  }

  requestChangeDate(gameId: number, data: ApiGameRequestChangeDateRequest) {
    return useApi<ApiGameResponse>(`${PREFIX}/${gameId}/request-change-date`, {
      method: 'PUT',
      body: data,
    })
  }

  approveRequestedDate(gameId: number) {
    return useApi<ApiGameResponse>(
      `${PREFIX}/${gameId}/approve-requested-date`,
      {
        method: 'PUT',
      },
    )
  }
}
