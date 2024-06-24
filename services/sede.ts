import {
  ApiSedeResponse,
  ApiSedesResponse,
  ApiSedeRequest,
} from '@/types/api/sede'

const PREFIX = 'sedes'

export default class SedeService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiSedesResponse>(`${PREFIX}/fetch`, { params })
  }

  get(sedeId: number, params?: Record<string, string>) {
    return useApi<ApiSedeResponse>(`${PREFIX}/${sedeId}`, { params })
  }

  store(data: ApiSedeRequest) {
    return useApi<ApiSedeResponse>(`${PREFIX}`, {
      method: 'POST',
      body: data,
    })
  }

  update(sedeId: number, data: ApiSedeRequest) {
    return useApi<ApiSedeResponse>(`${PREFIX}/${sedeId}`, {
      method: 'PUT',
      body: data,
    })
  }

  destroy(sedeId: number) {
    return useApi<ApiSedeResponse>(`${PREFIX}/${sedeId}`, {
      method: 'DELETE',
    })
  }
}
