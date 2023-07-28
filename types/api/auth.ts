export type User = {
  id: number
  email: string
  email_verified_at: string
  created_at: string
  updated_at: string
  deleted_at: string
}

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
