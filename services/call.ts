import {
  ApiCallUpdateRequest,
  ApiCallResponse,
  ApiCallsResponse,
} from '@/types/api/call'
import {
  CallObservationsRequest,
  CallSignRequest,
  mapCallObservationsRequestToApiCallObservationsRequest,
  mapCallSignRequestToApiCallSignRequest,
} from '@/domain/call'

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

  observations(callId: number, data: CallObservationsRequest) {
    return useApi<ApiCallResponse>(`calls/${callId}/observations`, {
      method: 'PUT',
      body: mapCallObservationsRequestToApiCallObservationsRequest(data),
    })
  }

  sign(callId: number, data: CallSignRequest) {
    return useApi<ApiCallResponse>(`calls/${callId}/sign`, {
      method: 'PUT',
      body: mapCallSignRequestToApiCallSignRequest(data),
    })
  }
}
