import { LicensableType } from '@/domain/licensable'
import { CountryCode } from '@/domain/country'
import { NestedArray } from '@/domain/utils'
import { ApiUser } from '@/types/api/user'
import { ApiLicensableModel } from '@/types/api/licensable'

export type ApiLicenseRelations = {
  licensable?: ApiLicensableModel
  validator?: ApiUser
}

export type ApiLicense = {
  id: number
  licensable_id: number
  licensable_type: LicensableType
  licensable_name: string
  name: string
  type: LicensableType
  license_number: string
  country_code: CountryCode
  expiry_date: string
  expired: boolean
  observations: string | null
  verified: boolean
  verified_by: string | null
  filepath: string | null
  original_filename: string | null
  meta: NestedArray | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiLicenseRelations

export type ApiLicenseStoreRequest = {
  licensable_id: number
  name: string
  type: LicensableType
  license_number: string
  country_code: CountryCode
  expiry_date: string
  observations: string | null
  file: File | null
  meta: NestedArray | null
}

export type ApiLicenseUpdateRequest = {
  name: string
  license_number: string
  country_code: CountryCode
  expiry_date: string
  observations: string | null
  file: File | null
  meta: NestedArray | null
}

export type ApiLicenseResponse = {
  success: boolean
  data: {
    license: ApiLicense
  }
  errors: null
}
