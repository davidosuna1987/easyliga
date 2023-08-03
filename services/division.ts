import { ApiDivisionResponse } from '@/types/api/division'

export default class DivisionService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiDivisionResponse>(`divisions/fetch`, { params })
  }
}
