import { defineStore } from 'pinia'
import { ApiGender } from '@/types/api/gender'
import GenderService from '@/services/gender'

const genderService = new GenderService()

export const useGenderStore = defineStore('genders', () => {
  const genders = ref<ApiGender[]>([])

  const fetch = async () => {
    const response = await genderService.fetch()

    genders.value = response.data.value?.data.genders ?? []

    return response
  }

  return {
    genders,
    fetch,
  }
})
