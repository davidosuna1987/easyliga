import { ApiProfile, ApiProfileUpdateRequest } from '@/types/api/profile'
import { User } from '@/domain/user'
import {
  Address,
  mapAddressToApiAddress,
  mapApiAddressToAddress,
} from '@/domain/address'
import { Coach } from '@/domain/team'

export const PROFILE_GENDER_TYPES = {
  male: 'male',
  female: 'female',
  other: 'other',
} as const

export type ProfileGender = keyof typeof PROFILE_GENDER_TYPES

export const AVATAR_STYLES = {
  background: '#333333',
  color: '#ffffff',
  fontWeight: 700,
} as const

export type Image = {
  preview: string | null
  file: File | null
  name: string | null
  size: number | null
}

export type ProfileRelations = {
  user?: User
  address?: Address
}

export type Profile = {
  id: number
  userId: number
  primary?: boolean
  firstName: string
  lastName: string
  birthDate?: string
  gender?: ProfileGender
  avatar?: string
  email: string
  phone?: string
  playerId?: number
} & ProfileRelations

export type ProfileUpdateRequest = {
  email: string
  firstName: string
  lastName: string
  birthDate?: Date
  gender?: ProfileGender
  avatar?: Image
  phone?: string
  address?: Address
}

export type Responsible = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
}

export const mapApiProfileToProfile = (apiProfile: ApiProfile): Profile => ({
  id: apiProfile.id,
  userId: apiProfile.user_id,
  firstName: apiProfile.first_name,
  lastName: apiProfile.last_name,
  birthDate: apiProfile.birth_date ?? undefined,
  gender: apiProfile.gender ?? undefined,
  avatar: apiProfile.avatar ?? undefined,
  email: apiProfile.email ?? undefined,
  phone: apiProfile.phone ?? undefined,
  playerId: apiProfile.player_id ?? undefined,
  address: apiProfile.address
    ? mapApiAddressToAddress(apiProfile.address)
    : undefined,
})

export const mapApiProfileToCoach = (apiProfile: ApiProfile): Coach => ({
  ...mapApiProfileToProfile(apiProfile),
  coach: true,
})

export const mapProfileUpdateRequestToApiProfileUpdateRequest = (
  profileUpdateRequest: ProfileUpdateRequest,
): ApiProfileUpdateRequest => {
  const apiAddress = profileUpdateRequest.address
    ? mapAddressToApiAddress(profileUpdateRequest.address)
    : null
  return {
    email: profileUpdateRequest.email ?? null,
    first_name: profileUpdateRequest.firstName,
    last_name: profileUpdateRequest.lastName,
    birth_date: profileUpdateRequest.birthDate
      ? profileUpdateRequest.birthDate.toISOString().split('T')[0]
      : null,
    gender: profileUpdateRequest.gender ?? null,
    avatar: profileUpdateRequest.avatar?.file ?? null,
    phone: profileUpdateRequest.phone ?? null,
    line1: apiAddress?.line1 ?? null,
    line2: apiAddress?.line2 ?? null,
    city: apiAddress?.city ?? null,
    state: apiAddress?.state ?? null,
    country: apiAddress?.country ?? null,
    country_code: apiAddress?.country_code ?? null,
    postal_code: apiAddress?.postal_code ?? null,
  }
}

export const mapProfileToProfileUpdateRequest = (
  profile: Profile,
): ProfileUpdateRequest => ({
  email: profile.email,
  firstName: profile.firstName,
  lastName: profile.lastName,
  birthDate: profile.birthDate ? new Date(profile.birthDate) : undefined,
  gender: profile.gender,
  avatar: undefined,
  phone: profile.phone,
  address: profile.address,
})

export const mapApiProfileUpdateRequestToFormData = (
  data: ApiProfileUpdateRequest,
): FormData => {
  const formData = new FormData()

  formData.append('email', data.email ?? '')
  formData.append('first_name', data.first_name)
  formData.append('last_name', data.last_name)
  formData.append('birth_date', data.birth_date ?? '')
  formData.append('gender', data.gender ?? '')
  formData.append('avatar', data.avatar ?? '')
  formData.append('phone', data.phone ?? '')
  formData.append('line1', data.line1 ?? '')
  formData.append('line2', data.line2 ?? '')
  formData.append('city', data.city ?? '')
  formData.append('state', data.state ?? '')
  formData.append('country', data.country ?? '')
  formData.append('country_code', data.country_code ?? '')
  formData.append('postal_code', data.postal_code ?? '')

  return formData
}
