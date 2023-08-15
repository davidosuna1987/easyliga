import { ApiCallUpdateRequest, ApiCallResponse } from '@/types/api/call'

export default class CallService {
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
