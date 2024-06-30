import { ApiGenderResponse } from '@/types/api/gender'

const PREFIX = 'genders'

export default class GenderService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiGenderResponse>(`${PREFIX}/fetch`, { params })
  }
}
