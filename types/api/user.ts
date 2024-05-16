import { ApiProfile } from '@/types/api/profile'

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
