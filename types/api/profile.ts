import { ApiUser } from '@/types/api/user'
import { ApiFreshData } from '@/types/api/auth'
import { ApiAddress, ApiAddressUpdateRequest } from '@/types/api/address'
import { ProfileGender, NifType } from '@/domain/profile'
import { ApiLicense } from '@/types/api/license'

export type ProfileRelations = {
  user?: ApiUser
  address?: ApiAddress
  licenses?: ApiLicense[]
}

export type ApiProfile = {
  id: number
  user_id: number
  address_id: number
  primary: boolean
  first_name: string
  last_name: string
  birth_date: string | null
  gender: ProfileGender | null
  avatar: string | null
  phone: string | null
  nif: string | null
  nif_type: NifType | null
  email: string
  player_id: number | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ProfileRelations

export type ApiProfileResponse = {
  success: boolean
  data: ApiFreshData
  errors: null
}

export type ApiProfilesResponse = {
  success: true
  data: {
    profiles: ApiProfile[]
  }
  errors: null
}

export type ApiClubTeamPlayerProfileUpdateResponse = {
  success: true
  data: {
    profile: ApiProfile
  }
  errors: null
}

export type ApiProfileUpdateRequest = {
  email: string | null
  first_name: string
  last_name: string
  birth_date: string | null
  gender: ProfileGender | null
  avatar: File | null
  phone: string | null
  nif: string | null
  nif_type: NifType | null
} & Omit<ApiAddressUpdateRequest, 'id'>
