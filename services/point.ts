import { ApiPointResponse, ApiPointStoreRequest } from '@/types/api/point'

export default class PointService {
  store(data: ApiPointStoreRequest) {
    return useApi<ApiPointResponse>(`points`, {
      method: 'POST',
      body: data,
    })
  }

  destroy(pointId: number) {
    return useApi<ApiPointResponse>(`points/${pointId}`, {
      method: 'DELETE',
    })
  }
}
