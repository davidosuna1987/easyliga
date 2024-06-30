import { ApiTimeoutResponse } from '@/types/api/timeout'
import {
  TimeoutStoreRequest,
  TimeoutUpdateRequest,
  mapTimeoutStoreRequestToApiTimeoutStoreRequest,
  mapTimeoutUpdateRequestToApiTimeoutUpdateRequest,
} from '@/domain/timeout'

const PREFIX = 'timeouts'

export default class TimeoutService {
  store(data: TimeoutStoreRequest) {
    return useApi<ApiTimeoutResponse>(`${PREFIX}`, {
      method: 'POST',
      body: mapTimeoutStoreRequestToApiTimeoutStoreRequest(data),
    })
  }

  update(timeoutId: number, data: TimeoutUpdateRequest) {
    return useApi<ApiTimeoutResponse>(`${PREFIX}/${timeoutId}`, {
      method: 'PUT',
      body: mapTimeoutUpdateRequestToApiTimeoutUpdateRequest(data),
    })
  }
}
