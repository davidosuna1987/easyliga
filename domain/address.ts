import { ApiAddress } from '@/types/api/address'
import { CountryCode } from '@/domain/country'

export type Address = {
  id: number
  line1?: string
  line2?: string
  city?: string
  state?: string
  country?: string
  countryCode?: CountryCode
  postalCode?: string
}

export const mapAddress = (address?: Address): Address => ({
  id: address?.id ?? 0,
  line1: address?.line1 ?? undefined,
  line2: address?.line2 ?? undefined,
  city: address?.city ?? undefined,
  state: address?.state ?? undefined,
  country: address?.country ?? undefined,
  countryCode: address?.countryCode ?? undefined,
  postalCode: address?.postalCode ?? undefined,
})

export const mapApiAddressToAddress = (apiAddress?: ApiAddress): Address => ({
  id: apiAddress?.id ?? 0,
  line1: apiAddress?.line1 ?? undefined,
  line2: apiAddress?.line2 ?? undefined,
  city: apiAddress?.city ?? undefined,
  state: apiAddress?.state ?? undefined,
  country: apiAddress?.country ?? undefined,
  countryCode: apiAddress?.country_code ?? undefined,
  postalCode: apiAddress?.postal_code ?? undefined,
})

export const mapAddressToApiAddress = (address?: Address): ApiAddress => ({
  id: address?.id ?? 0,
  line1: address?.line1 ?? null,
  line2: address?.line2 ?? null,
  city: address?.city ?? null,
  state: address?.state ?? null,
  country: address?.country ?? null,
  country_code: address?.countryCode ?? null,
  postal_code: address?.postalCode ?? null,
})
