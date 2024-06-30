import { ApiCategoryResponse } from '@/types/api/category'

const PREFIX = 'categories'

export default class CategoriesService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiCategoryResponse>(`${PREFIX}/fetch`, { params })
  }
}
