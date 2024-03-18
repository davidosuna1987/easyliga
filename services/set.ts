import {
  ApiSetsResponse,
  ApiSetStartRequest,
  ApiSetTeamIncompleteResponse,
} from '@/types/api/set'
import { SanctionSeverityKey, SanctionTypeKey } from '@/domain/sanction'

const SETS_API_PREFIX = 'sets'

export default class SetService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiSetsResponse>(`sets/fetch`, { params })
  }

  start(setId: number, data: ApiSetStartRequest) {
    return useApi(`sets/${setId}/start`, {
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
      `${SETS_API_PREFIX}/${setId}/teams/${teamId}/incomplete`,
      { params },
    )
  }
}
