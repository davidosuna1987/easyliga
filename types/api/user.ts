import { ApiProfile } from '@/types/api/profile'
import { Role } from '@/domain/role'
import { ApiLicense } from '@/types/api/license'
import { ApiClub } from '@/types/api/club'
import { ApiFederation } from '@/types/api/federation'
import { ApiSede } from '@/types/api/sede'
import { ApiTeam } from '@/types/api/team'
import { LicensableModelType } from '@/domain/licensable'

export type ApiUserRelations = {
  profile?: ApiProfile
  managed_federations?: ApiFederation[]
  managed_clubs?: ApiClub[]
  managed_sedes?: ApiSede[]
  licenses?: ApiLicense[]
}

export type ApiUser = {
  id: number
  email: string
  email_verified_at: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiUserRelations

export type ApiManagedModel = ApiFederation | ApiClub | ApiTeam | ApiProfile

export type ApiManagedModelMapped = {
  id: number
  name: string
  type: LicensableModelType
}

export type ApiManagedModels = Record<LicensableModelType, ApiManagedModel[]>

export type ApiManagedModelsMapped = Record<
  LicensableModelType,
  ApiManagedModelMapped[]
>

export type ApiUserSearchRequest = {
  search: string
}

export type ApiInviteRequest = {
  email: String
  roles: Role[]
}

export type ApiUserResponse = {
  success: boolean
  data: {
    user: ApiUser
  }
  errors: null
}

export type ApiUsersResponse = {
  success: boolean
  data: {
    users: ApiUser[]
  }
  errors: null
}
