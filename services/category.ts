import { ApiCategoryResponse } from '@/types/api/category'

export default class Categorieservice {
  fetch(params?: Record<string, string>) {
    return useApi<ApiCategoryResponse>(`categories/fetch`, { params })
  }
}
