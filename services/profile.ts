import {
  ApiProfileResponse,
  ApiProfileUpdateRequest,
} from '@/types/api/profile'

import { mapApiProfileUpdateRequestToFormData } from '@/domain/profile'

export default class ProfileService {
  update(profileId: number, data: ApiProfileUpdateRequest) {
    return useApi<ApiProfileResponse>(`profiles/${profileId}`, {
      method: 'POST',
      body: mapApiProfileUpdateRequestToFormData(data),
    })
  }
}
