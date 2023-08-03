import { defineStore } from 'pinia'
import { ApiCategory } from '@/types/api/category'
import CategoryService from '@/services/category'

const categoryService = new CategoryService()

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<ApiCategory[]>([])

  const fetch = async () => {
    const response = await categoryService.fetch()

    categories.value = response.data.value?.data.categories ?? []

    return response
  }

  return {
    categories,
    fetch,
  }
})
