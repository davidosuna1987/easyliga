import {
  ApiGameTeamPlayersResponse,
  ApiGameInitialDataResponse,
  ApiGameResponse,
  ApiGamesResponse,
  ApiGameStoreRequest,
  ApiGameTeamIncompleteResponse,
  ApiGameReportSimpleResponse,
  ApiGameRequestChangeDateRequest,
  ApiGamePartials,
  ApiGamePartialsAssignRequest,
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

  start(gameId: number) {
    return useApi<ApiGameResponse>(`${PREFIX}/${gameId}/start`, {
      method: 'PUT',
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

  addReferee(gameId: number, refereeId: number) {
    return useApi<ApiGameResponse>(`${PREFIX}/${gameId}/add-referee`, {
      method: 'PUT',
      body: { referee_id: refereeId },
    })
  }

  assignPartials(gameId: number, data: ApiGamePartialsAssignRequest) {
    return useApi<ApiGameResponse>(`${PREFIX}/${gameId}/assign-partials`, {
      method: 'PUT',
      body: data,
    })
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

  changeDate(gameId: number, data: ApiGameRequestChangeDateRequest) {
    return useApi<ApiGameResponse>(`${PREFIX}/${gameId}/change-date`, {
      method: 'PUT',
      body: data,
    })
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
