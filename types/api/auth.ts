import {
  ApiManagedModel,
  ApiManagedModels,
  ApiManagedModelMapped,
  ApiManagedModelsMapped,
  ApiUser,
} from '@/types/api/user'
import { ApiProfile } from '@/types/api/profile'
import { ApiLicense } from '@/types/api/license'

export type Role =
  | 'admin'
  | 'staff'
  | 'federation'
  | 'club'
  | 'referee'
  | 'coach'
  | 'player'
  | 'user'

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
  shirt_number?: number
}

export type ApiRegisterByInviteRequest = ApiRegisterRequest & {
  code: string
}

export type ApiVerifyRequest = {
  user_id: number
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

export type ApiLoginAsRequest = {
  user_id: number
}

export type AuthuserResponse = {
  success: true
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
  licenses: ApiLicense[]
}

export type ApiLoginData = ApiFreshData & {
  token: string
}

export type ApiLoginResponse = {
  success: boolean
  data: ApiLoginData
  errors: null
}

export type ApiFreshResponse = {
  success: boolean
  data: ApiFreshData
  errors: null
}

export type ApiManagedModelResponse = {
  success: true
  data: {
    managed: ApiManagedModel[]
  }
  errors: null
}

export type ApiManagedModelMappedResponse = {
  success: true
  data: {
    managed: ApiManagedModelMapped[]
  }
  errors: null
}

export type ApiManagedModelsResponse = {
  success: true
  data: {
    managed: ApiManagedModels
  }
  errors: null
}

export type ApiManagedModelsMappedResponse = {
  success: true
  data: {
    managed: ApiManagedModelsMapped
  }
  errors: null
}

export type ApiMessageResponse = {
  success: true
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
  success: false
  data: null
  errors: ErrorResponseErrors
}
