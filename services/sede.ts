import { ApiSedeResponse } from '@/types/api/sede'

export default class SedeService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiSedeResponse>(`sedes/fetch`, { params })
  }

  get(sedeId: number, params?: Record<string, string>) {
    return useApi<ApiSedeResponse>(`sedes/${sedeId}`, { params })
  }
}
