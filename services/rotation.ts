import {
  ApiRotationStoreRequest,
  ApiRotationsResponse,
} from '@/types/api/rotation'

export default class RotationService {
  store(data: ApiRotationStoreRequest) {
    return useApi<ApiRotationsResponse>(`rotations`, {
      method: 'POST',
      body: data,
    })
  }
}
