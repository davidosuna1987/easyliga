import {
  ApiProfileResponse,
  ApiProfilesResponse,
  ApiProfileUpdateRequest,
} from '@/types/api/profile'

import { mapApiProfileUpdateRequestToFormData } from '@/domain/profile'

export default class ProfileService {
  search(params?: Record<string, string>) {
    return useApi<ApiProfilesResponse>(`players/search`, { params })
  }

  update(profileId: number, data: ApiProfileUpdateRequest) {
    return useApi<ApiProfileResponse>(`profiles/${profileId}`, {
      method: 'POST',
      body: mapApiProfileUpdateRequestToFormData(data),
    })
  }
}
