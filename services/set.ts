import {
  ApiSetsResponse,
  ApiSetStartRequest,
  ApiSetTeamIncompleteResponse,
} from '@/types/api/set'
import { SanctionSeverityKey, SanctionTypeKey } from '@/domain/sanction'

const PREFIX = 'sets'

export default class SetService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiSetsResponse>(`${PREFIX}/fetch`, { params })
  }

  start(setId: number, data: ApiSetStartRequest) {
    return useApi(`${PREFIX}/${setId}/start`, {
      method: 'PUT',
      body: data,
    })
  }

  teamIncomplete(
    setId: number,
    teamId: number,
    params?: {
      type: Omit<SanctionTypeKey, 'team'>
      severity: Omit<SanctionSeverityKey, 'warning' | 'point'>
      player_profile_id: number
    },
  ) {
    return useApi<ApiSetTeamIncompleteResponse>(
      `${PREFIX}/${setId}/teams/${teamId}/incomplete`,
      { params },
    )
  }
}
