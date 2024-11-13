import { ApiTeamResponse, ApiTeamsResponse } from '@/types/api/team'
import {
  TeamFormRequest,
  TeamPlayersFormRequest,
  mapTeamFormRequestToApiTeamRequest,
  mapTeamPlayersFormRequestToApiTeamPlayersRequest,
} from '@/domain/team'
import {
  ApiPlayerRequest,
  ApiPlayerStoreRequest,
  ApiPlayerStoreResponse,
} from '@/types/api/player'

const PREFIX = 'teams'

export default class TeamService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiTeamsResponse>(`${PREFIX}/fetch`, { params })
  }

  get(teamId: number, params?: Record<string, string>) {
    return useApi<ApiTeamResponse>(`${PREFIX}/${teamId}`, { params })
  }

  store(data: TeamFormRequest) {
    return useApi<ApiTeamResponse>(`${PREFIX}`, {
      method: 'POST',
      body: mapTeamFormRequestToApiTeamRequest(data),
    })
  }

  update(teamId: number, data: TeamFormRequest) {
    return useApi<ApiTeamResponse>(`${PREFIX}/${teamId}`, {
      method: 'PUT',
      body: mapTeamFormRequestToApiTeamRequest(data),
    })
  }

  updatePlayers(teamId: number, data: TeamPlayersFormRequest) {
    return useApi<ApiTeamResponse>(`${PREFIX}/${teamId}/players`, {
      method: 'PUT',
      body: mapTeamPlayersFormRequestToApiTeamPlayersRequest(data),
    })
  }

  deletePlayer(teamId: number, profileId: number) {
    return useApi<ApiTeamResponse>(`${PREFIX}/${teamId}/players/${profileId}`, {
      method: 'DELETE',
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
    return useApi<ApiTeamResponse>(`${PREFIX}/${teamId}/players/add`, {
      method: 'POST',
      body: data,
    })
  }

  createPlayer(teamId: number, data: ApiPlayerStoreRequest) {
    return useApi<ApiPlayerStoreResponse>(
      `${PREFIX}/${teamId}/players/create`,
      {
        method: 'POST',
        body: data,
      },
    )
  }
}
