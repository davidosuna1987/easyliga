import {
  ApiCallUpdateRequest,
  ApiCallResponse,
  ApiCallsResponse,
} from '@/types/api/call'

export default class CallService {
  get(callId: number, params?: Record<string, string>) {
    return useApi<ApiCallResponse>(`calls/${callId}`, { params })
  }

  fetch(params?: Record<string, string>) {
    return useApi<ApiCallsResponse>(`calls/fetch`, { params })
  }

  update(callId: number, data: ApiCallUpdateRequest) {
    return useApi<ApiCallResponse>(`calls/${callId}`, {
      method: 'PUT',
      body: data,
    })
  }
  unlock(callId: number) {
    return useApi<ApiCallResponse>(`calls/${callId}/unlock`, {
      method: 'PUT',
    })
  }
}
