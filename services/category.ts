import { ApiCategoryResponse } from '@/types/api/category'

export default class CategoriesService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiCategoryResponse>(`categories/fetch`, { params })
  }
}
