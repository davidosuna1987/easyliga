import {
  ApiRotationStoreRequest,
  ApiRotationsResponse,
  ApiRotationResponse,
  ApiRotationUpdateRequest,
} from '@/types/api/rotation'

export default class RotationService {
  get(rotationId: number, params?: Record<string, string>) {
    return useApi<ApiRotationResponse>(`rotations/${rotationId}`, { params })
  }

  store(data: ApiRotationStoreRequest) {
    return useApi<ApiRotationsResponse>(`rotations`, {
      method: 'POST',
      body: data,
    })
  }

  update(rotationId: number, data: ApiRotationUpdateRequest) {
    return useApi<ApiRotationsResponse>(`rotations/${rotationId}`, {
      method: 'PUT',
      body: data,
    })
  }
}
