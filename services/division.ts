import { ApiDivisionResponse } from '@/types/api/division'

const PREFIX = 'divisions'

export default class DivisionService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiDivisionResponse>(`${PREFIX}/fetch`, { params })
  }
}
