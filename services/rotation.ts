import {
  ApiRotationStoreRequest,
  ApiRotationsResponse,
  ApiRotationResponse,
  ApiRotationUpdateRequest,
} from '@/types/api/rotation'

const PREFIX = 'rotations'

export default class RotationService {
  get(rotationId: number, params?: Record<string, string>) {
    return useApi<ApiRotationResponse>(`${PREFIX}/${rotationId}`, { params })
  }

  store(data: ApiRotationStoreRequest) {
    return useApi<ApiRotationsResponse>(`${PREFIX}`, {
      method: 'POST',
      body: data,
    })
  }

  update(rotationId: number, data: ApiRotationUpdateRequest) {
    return useApi<ApiRotationsResponse>(`${PREFIX}/${rotationId}`, {
      method: 'PUT',
      body: data,
    })
  }

  unlock(rotationId: number) {
    return useApi<ApiRotationResponse>(`${PREFIX}/${rotationId}/unlock`, {
      method: 'PUT',
    })
  }

  lock(rotationId: number) {
    return useApi<ApiRotationResponse>(`${PREFIX}/${rotationId}/lock`, {
      method: 'PUT',
    })
  }

  approvePlayerChange(rotationId: number, playerRotationId: number) {
    return useApi<ApiRotationResponse>(
      `${PREFIX}/${rotationId}/player-rotation/${playerRotationId}/approve`,
      {
        method: 'PUT',
      },
    )
  }

  denyPlayerChange(
    rotationId: number,
    playerRotationId: number,
    denyReason?: string,
  ) {
    return useApi<ApiRotationResponse>(
      `${PREFIX}/${rotationId}/player-rotation/${playerRotationId}/deny`,
      {
        method: 'PUT',
        body: { deny_reason: denyReason },
      },
    )
  }
}
