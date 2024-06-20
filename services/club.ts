import {
  ApiClubFormRequest,
  ApiClubResponse,
  ApiClubsResponse,
} from '@/types/api/club'
import {
  ApiClubTeamPlayerProfileUpdateResponse,
  ApiProfileUpdateRequest,
} from '@/types/api/profile'
import { mapApiProfileUpdateRequestToFormData } from '@/domain/profile'

const PREFIX = 'clubs'

export default class ClubService {
  get(clubId: number, params?: Record<string, string>) {
    return useApi<ApiClubResponse>(`${PREFIX}/${clubId}`, { params })
  }

  fetch(params?: Record<string, string>) {
    return useApi<ApiClubsResponse>(`${PREFIX}/fetch`, { params })
  }

  update(clubId: number, data: ApiClubFormRequest) {
    return useApi<ApiClubResponse>(`${PREFIX}/${clubId}`, {
      method: 'PUT',
      body: data,
    })
  }

  updateTeamPlayerProfile(
    clubId: number,
    teamId: number,
    profileId: number,
    data: ApiProfileUpdateRequest,
    params?: Record<string, string>,
  ) {
    return useApi<ApiClubTeamPlayerProfileUpdateResponse>(
      `clubs/${clubId}/teams/${teamId}/players/${profileId}/profile`,
      {
        method: 'POST',
        body: mapApiProfileUpdateRequestToFormData(data),
        params,
      },
    )
  }
}
