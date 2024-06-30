import { ApiPointResponse, ApiPointStoreRequest } from '@/types/api/point'

const PREFIX = 'points'

export default class PointService {
  store(data: ApiPointStoreRequest) {
    return useApi<ApiPointResponse>(`${PREFIX}`, {
      method: 'POST',
      body: data,
    })
  }

  destroy(pointId: number) {
    return useApi<ApiPointResponse>(`${PREFIX}/${pointId}`, {
      method: 'DELETE',
    })
  }
}
