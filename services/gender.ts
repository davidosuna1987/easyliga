import { ApiGenderResponse } from '@/types/api/gender'

export default class GenderService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiGenderResponse>(`genders/fetch`, { params })
  }
}
