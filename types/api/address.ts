import { type } from 'os'

export type ApiAddress = {
  line1: string | null
  line2: string | null
  city: string | null
  state: string | null
  country: string | null
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
  line1: string | null
  line2: string | null
  city: string | null
  state: string | null
  country: string | null
  postal_code: string | null
}
