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

export type ApiPlayer = ApiProfile & {
  pivot: {
    team_id: number
    profile_id: number
    shirt_number: number
    captain: boolean
    libero: boolean
  }
}

export type Role = string

export type ApiLoginRequest = {
  email: string
  password: string
}

export type ApiRegisterRequest = {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirm: string
}

export type ApiVerifyRequest = {
  user: number
  token: string
}

export type ApiForgotRequest = {
  email: string
}

export type ApiResetRequest = {
  email: string
  token: string
  password: string
  password_confirm: string
}

export type AuthuserResponse = {
  success: boolean
  data: {
    user: ApiUser
  }
  errors: null
}

export type ApiFreshData = {
  user: ApiUser
  profile: ApiProfile
  profiles: ApiProfile[]
  roles: Role[]
}

export type ApiLoginData = ApiFreshData & {
  token: string
}

export type ApiLoginResponse = {
  success: boolean
  data: ApiLoginData
  errors: null
}

export type ApiMessageResponse = {
  success: boolean
  data: {
    message: string
  }
  errors: null
}

export type ErrorResponseErrors =
  | {
      [key: string]: string[]
    }
  | {
      [key: number]: string
    }

export type ErrorResponse = {
  success: boolean
  data: null
  errors: ErrorResponseErrors
}
