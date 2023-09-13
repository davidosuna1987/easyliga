import { ApiAddress } from '@/types/api/address'

export type Address = {
  line1?: string
  line2?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
}

export const mapApiAddressToAddress = (apiAddress: ApiAddress): Address => ({
  line1: apiAddress.line1 ?? undefined,
  line2: apiAddress.line2 ?? undefined,
  city: apiAddress.city ?? undefined,
  state: apiAddress.state ?? undefined,
  country: apiAddress.country ?? undefined,
  postalCode: apiAddress.postal_code ?? undefined,
})

export const mapAddressToApiAddress = (address: Address): ApiAddress => ({
  line1: address.line1 ?? null,
  line2: address.line2 ?? null,
  city: address.city ?? null,
  state: address.state ?? null,
  country: address.country ?? null,
  postal_code: address.postalCode ?? null,
})
