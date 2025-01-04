import { CountryCode } from '@/domain/country'

export type ApiBillingAddress = {
  id: number
  user_id: number
  name: string
  line1: string
  line2: string
  city: string
  state: string
  country: string
  country_code: CountryCode
  postal_code: string
  tax_id: string | null
  tax_country: string | null
  tax_label: string | null
  tax_value: string
}

export type ApiAddressFormRequest = {
  id: number
  user_id: number
  name: string
  line1: string
  line2: string
  city: string
  state: string
  country: string
  country_code: CountryCode
  postal_code: string
  tax_id: string | null
  tax_country: string | null
  tax_label: string | null
  tax_value: string
}

export type ApiBillingAddressResponse = {
  success: true
  data: {
    billing_address: ApiBillingAddress
  }
  errors: null
}
