import { ApiClubResponse, ApiClubsResponse } from '@/types/api/club'
import {
  ApiClubTeamPlayerProfileUpdateResponse,
  ApiProfileUpdateRequest,
} from '@/types/api/profile'
import { mapApiProfileUpdateRequestToFormData } from '@/domain/profile'

export default class ClubService {
  get(clubId: number, params?: Record<string, string>) {
    return useApi<ApiClubResponse>(`clubs/${clubId}`, { params })
  }

  fetch(params?: Record<string, string>) {
    return useApi<ApiClubsResponse>(`clubs/fetch`, { params })
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
