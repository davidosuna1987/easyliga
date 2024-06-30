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

const PREFIX = 'calls'

export default class CallService {
  get(callId: number, params?: Record<string, string>) {
    return useApi<ApiCallResponse>(`${PREFIX}/${callId}`, { params })
  }

  fetch(params?: Record<string, string>) {
    return useApi<ApiCallsResponse>(`${PREFIX}/fetch`, { params })
  }

  update(callId: number, data: ApiCallUpdateRequest) {
    return useApi<ApiCallResponse>(`${PREFIX}/${callId}`, {
      method: 'PUT',
      body: data,
    })
  }

  unlock(callId: number) {
    return useApi<ApiCallResponse>(`${PREFIX}/${callId}/unlock`, {
      method: 'PUT',
    })
  }

  observations(callId: number, data: CallObservationsRequest) {
    return useApi<ApiCallResponse>(`${PREFIX}/${callId}/observations`, {
      method: 'PUT',
      body: mapCallObservationsRequestToApiCallObservationsRequest(data),
    })
  }

  sign(callId: number, data: CallSignRequest) {
    return useApi<ApiCallResponse>(`${PREFIX}/${callId}/sign`, {
      method: 'PUT',
      body: mapCallSignRequestToApiCallSignRequest(data),
    })
  }
}
