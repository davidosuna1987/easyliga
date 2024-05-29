import { defineStore } from 'pinia'
import { Country, getCountries } from '@/domain/country'

export const useCountryStore = defineStore('countries', () => {
  const countries = ref<Country[]>([])

  onMounted(() => {
    countries.value = getCountries()
  })

  return {
    countries,
  }
})
