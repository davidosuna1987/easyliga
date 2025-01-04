import { ApiBillingAddress } from '@/types/api/billing_address'
import { CountryCode } from '@/domain/country'

export type BillingAddress = {
  id: number
  userId: number
  name: string
  line1: string
  line2: string
  city: string
  state: string
  country: string
  countryCode: CountryCode
  postalCode: string
  taxId?: string
  taxCountry?: string
  taxLabel?: string
  taxValue: string
}

export const mapAddress = (
  billingAddress?: BillingAddress,
): BillingAddress => ({
  id: billingAddress?.id ?? 0,
  userId: billingAddress?.userId ?? 0,
  name: billingAddress?.name ?? '',
  line1: billingAddress?.line1 ?? '',
  line2: billingAddress?.line2 ?? '',
  city: billingAddress?.city ?? '',
  state: billingAddress?.state ?? '',
  country: billingAddress?.country ?? '',
  countryCode: billingAddress?.countryCode ?? 'ES',
  postalCode: billingAddress?.postalCode ?? '',
  taxId: billingAddress?.taxId ?? undefined,
  taxCountry: billingAddress?.taxCountry ?? undefined,
  taxLabel: billingAddress?.taxLabel ?? undefined,
  taxValue: billingAddress?.taxValue ?? '',
})

export const mapApiBillingAddressToBillingAddress = (
  apiBillingAddress: ApiBillingAddress,
): BillingAddress => ({
  id: apiBillingAddress?.id,
  userId: apiBillingAddress?.user_id,
  name: apiBillingAddress?.name,
  line1: apiBillingAddress?.line1,
  line2: apiBillingAddress?.line2,
  city: apiBillingAddress?.city,
  state: apiBillingAddress?.state,
  country: apiBillingAddress?.country,
  countryCode: apiBillingAddress?.country_code,
  postalCode: apiBillingAddress?.postal_code,
  taxId: apiBillingAddress?.tax_id ?? undefined,
  taxCountry: apiBillingAddress?.tax_country ?? undefined,
  taxLabel: apiBillingAddress?.tax_label ?? undefined,
  taxValue: apiBillingAddress?.tax_value,
})

export const mapBillingAddressToApiBillingAddress = (
  billingAddress: BillingAddress,
): ApiBillingAddress => ({
  id: billingAddress.id,
  user_id: billingAddress.userId,
  name: billingAddress.name,
  line1: billingAddress.line1,
  line2: billingAddress.line2,
  city: billingAddress.city,
  state: billingAddress.state,
  country: billingAddress.country,
  country_code: billingAddress.countryCode,
  postal_code: billingAddress.postalCode,
  tax_id: billingAddress.taxId ?? null,
  tax_country: billingAddress.taxCountry ?? null,
  tax_label: billingAddress.taxLabel ?? null,
  tax_value: billingAddress.taxValue,
})
