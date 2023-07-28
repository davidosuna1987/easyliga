export type User = {
  id: number
  email: string
  email_verified_at: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export type Profile = {
  id: number
  user_id: number
  address_id: number
  primary: boolean
  first_name: string
  last_name: string
  birthday: string | null
  gender: string | null
  avatar: string | null
  phone: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export type Role = string

export type LoginData = {
  email: string
  password: string
}

export type RegisterData = {
  email: string
  password: string
  password_confirm: string
}

export type VerifyData = {
  user: number
  token: string
}

export type ForgotData = {
  email: string
}

export type ResetData = {
  email: string
  token: string
  password: string
  password_confirm: string
}

export type AuthuserResponse = {
  success: boolean
  data: {
    user: User
  }
  errors: null
}

export type LoginResponse = {
  success: boolean
  data: {
    user: User
    profile: Profile
    profiles: Profile[]
    roles: Role[]
    token: string
  }
  errors: null
}

export type MessageResponse = {
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
