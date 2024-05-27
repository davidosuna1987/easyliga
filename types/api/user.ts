import { ApiProfile } from '@/types/api/profile'
import { Role } from '@/domain/role'

export type ApiUserRelations = {
  profile?: ApiProfile
}

export type ApiUser = {
  id: number
  email: string
  email_verified_at: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiUserRelations

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
