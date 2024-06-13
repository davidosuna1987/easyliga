import { Country, CountryCode, countries } from '@/domain/country'
import {
  LICENSABLE_TYPE_MAPPER,
  LicensableModel,
  LicensableType,
  // mapLicensableByType,
} from '@/domain/licensable'
import { User, mapApiUserToUser } from '@/domain/user'
import { NestedArray, formatDate } from '@/domain/utils'
import {
  ApiLicense,
  ApiLicenseStoreRequest,
  ApiLicenseUpdateRequest,
} from '@/types/api/license'

export const DEFAULT_LICENSE_COUNTRY_CODE = 'ES'

export type LicenseRelations = {
  licensable?: LicensableModel
  validator?: User
}

export type License = {
  id: number
  licensableId: number
  licensableType: LicensableType
  licensableName: string
  name: string
  type: LicensableType
  licenseNumber: string
  countryCode: CountryCode
  country: Country
  expiryDate: string
  expired: boolean
  observations?: string
  verified: boolean
  verifiedBy?: string
  filepath?: string
  originalFilename?: string
  meta?: NestedArray
} & LicenseRelations

export type LicenseStoreRequest = {
  id: number
  licensableId: number
  name: string
  type: LicensableType
  licenseNumber: string
  countryCode: CountryCode
  expiryDate: string
  observations?: string
  filepath?: string
  originalFilename?: string
  file?: File
  meta?: NestedArray
}

export type LicenseUpdateRequest = {
  name: string
  licenseNumber: string
  countryCode: CountryCode
  expiryDate: string
  observations?: string
  filepath?: string
  originalFilename?: string
  file?: File
  meta?: NestedArray
}

export const mapApiLicenseToLicense = (apiLicense: ApiLicense): License => ({
  id: apiLicense.id,
  licensableId: apiLicense.licensable_id,
  licensableType: apiLicense.licensable_type,
  licensableName: apiLicense.licensable_name,
  name: apiLicense.name,
  type: apiLicense.type,
  licenseNumber: apiLicense.license_number,
  countryCode: apiLicense.country_code,
  country: countries.find(
    country => country.alpha2Code === apiLicense.country_code,
  ) as Country,
  expiryDate: formatDate(apiLicense.expiry_date, '-', true),
  expired: apiLicense.expired,
  observations: apiLicense.observations ?? undefined,
  verified: apiLicense.verified,
  verifiedBy: apiLicense.verified_by ?? undefined,
  filepath: apiLicense.filepath ?? undefined,
  originalFilename: apiLicense.original_filename ?? undefined,
  meta: apiLicense.meta,
  // licensable: apiLicense.licensable
  //   ? mapLicensableByType(apiLicense.type, apiLicense.licensable)
  //   : undefined,
  validator: apiLicense.validator
    ? mapApiUserToUser(apiLicense.validator)
    : undefined,
})

export const mapLicenseToLicenseStoreRequest = ({
  license,
  type,
}:
  | {
      license: License
      type: undefined
    }
  | {
      license: undefined
      type: LicensableType
    }): LicenseStoreRequest => ({
  id: license?.id ?? 0,
  licensableId: license?.licensableId ?? 0,
  name: license?.name ?? '',
  type: license ? license.type : type,
  licenseNumber: license?.licenseNumber ?? '',
  countryCode: license?.countryCode ?? DEFAULT_LICENSE_COUNTRY_CODE,
  expiryDate: license?.expiryDate ?? '',
  observations: license?.observations,
  filepath: license?.filepath,
  originalFilename: license?.originalFilename,
  file: undefined,
  meta: license?.meta,
})

export const mapLicenseToLicenseUpdateRequest = (
  license: License,
): LicenseUpdateRequest => ({
  name: license.name,
  licenseNumber: license.licenseNumber,
  countryCode: license.countryCode,
  expiryDate: license.expiryDate,
  observations: license.observations,
  file: undefined,
  filepath: license.filepath,
  originalFilename: license.originalFilename,
  meta: license.meta,
})

export const mapLicenseStoreRequestToLicenseUpdateRequest = (
  data: LicenseStoreRequest,
): LicenseUpdateRequest => ({
  name: data.name,
  licenseNumber: data.licenseNumber,
  countryCode: data.countryCode,
  expiryDate: data.expiryDate,
  observations: data.observations,
  file: data.file,
  meta: data.meta,
})

export const mapLicenseStoreRequestToApiLicenseStoreRequest = (
  data: LicenseStoreRequest,
): ApiLicenseStoreRequest => ({
  licensable_id: data.licensableId,
  name: data.name,
  type: data.type,
  license_number: data.licenseNumber,
  country_code: data.countryCode,
  expiry_date: data.expiryDate,
  observations: data.observations ?? null,
  file: data.file ?? null,
  meta: data.meta ?? null,
})

export const mapLicenseUpdateRequestToApiLicenseUpdateRequest = (
  data: LicenseUpdateRequest,
): ApiLicenseUpdateRequest => ({
  name: data.name,
  license_number: data.licenseNumber,
  country_code: data.countryCode,
  expiry_date: data.expiryDate,
  observations: data.observations ?? null,
  file: data.file ?? null,
  meta: data.meta ?? null,
})

export const mapApiLicenseStoreRequestToFormData = (
  data: ApiLicenseStoreRequest,
): FormData => {
  const formData = new FormData()

  formData.append('licensable_id', data.licensable_id.toString())
  formData.append('name', data.name)
  formData.append('type', data.type)
  formData.append('license_number', data.license_number)
  formData.append('country_code', data.country_code)
  formData.append('expiry_date', data.expiry_date)
  formData.append('observations', data.observations ?? '')
  formData.append('file', data.file ?? '')
  formData.append('meta', data.meta ?? [])

  return formData
}

export const mapApiLicenseUpdateRequestToFormData = (
  data: ApiLicenseUpdateRequest,
): FormData => {
  const formData = new FormData()

  formData.append('name', data.name)
  formData.append('license_number', data.license_number)
  formData.append('country_code', data.country_code)
  formData.append('expiry_date', data.expiry_date)
  formData.append('observations', data.observations ?? '')
  formData.append('file', data.file ?? '')
  formData.append('meta', data.meta ?? [])

  return formData
}
