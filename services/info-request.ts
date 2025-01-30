import {
  ApiInfoRequestResponse,
  ApiInfoRequestsResponse,
} from '@/types/api/info-request'
import {
  InfoRequestStoreRequest,
  InfoRequestUpdateRequest,
  mapInfoRequestStoreRequestToApiInfoRequestStoreRequest,
  mapInfoRequestUpdateRequestToApiInfoRequestUpdateRequest,
} from '@/domain/info-request'

const PREFIX = 'info-request'

export default class InfoRequestService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiInfoRequestsResponse>(`${PREFIX}/fetch`, { params })
  }

  get(id: number) {
    return useApi<ApiInfoRequestResponse>(`${PREFIX}/${id}`)
  }

  search(search: string) {
    return useApi<ApiInfoRequestResponse>(`${PREFIX}/search/${search}`)
  }

  store(data: InfoRequestStoreRequest) {
    return useApi<ApiInfoRequestResponse>(`${PREFIX}`, {
      method: 'POST',
      body: mapInfoRequestStoreRequestToApiInfoRequestStoreRequest(data),
    })
  }

  update(id: number, data: InfoRequestUpdateRequest) {
    return useApi<ApiInfoRequestResponse>(`${PREFIX}/${id}`, {
      method: 'PUT',
      body: mapInfoRequestUpdateRequestToApiInfoRequestUpdateRequest(data),
    })
  }

  delete(id: number) {
    return useApi<ApiInfoRequestResponse>(`${PREFIX}/${id}`, {
      method: 'DELETE',
    })
  }
}
