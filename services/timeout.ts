import { ApiTimeoutResponse } from '@/types/api/timeout'
import {
  TimeoutStoreRequest,
  TimeoutUpdateRequest,
  mapTimeoutStoreRequestToApiTimeoutStoreRequest,
  mapTimeoutUpdateRequestToApiTimeoutUpdateRequest,
} from '@/domain/timeout'

export default class TimeoutService {
  store(data: TimeoutStoreRequest) {
    return useApi<ApiTimeoutResponse>(`timeouts`, {
      method: 'POST',
      body: mapTimeoutStoreRequestToApiTimeoutStoreRequest(data),
    })
  }

  update(timeoutId: number, data: TimeoutUpdateRequest) {
    return useApi<ApiTimeoutResponse>(`timeouts/${timeoutId}`, {
      method: 'PUT',
      body: mapTimeoutUpdateRequestToApiTimeoutUpdateRequest(data),
    })
  }
}
