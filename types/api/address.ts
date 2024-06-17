import { CountryCode } from '@/domain/country'

export type ApiAddress = {
  id: number
  line1: string | null
  line2: string | null
  city: string | null
  state: string | null
  country: string | null
  country_code: CountryCode | null
  postal_code: string | null
}

export type ApiAddressResponse = {
  success: boolean
  data: {
    address: ApiAddress
  }
  errors: null
}

export type ApiAddressUpdateRequest = {
  id: number
  line1: string | null
  line2: string | null
  city: string | null
  state: string | null
  country: string | null
  country_code: CountryCode | null
  postal_code: string | null
}
