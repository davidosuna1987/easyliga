import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

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

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  const logout = async () => {
    await useApi<MessageResponse>('auth/logout', { method: 'POST' })
    user.value = null
    navigateTo('/login')
  }

  const getAuthUser = async () => {
    const response = await useApi<AuthuserResponse>('auth/user')
    user.value = response.data.value?.data.user as User
  }

  const login = async (loginData: LoginData) => {
    const response = await useApi<LoginResponse>('auth/login', {
      method: 'POST',
      body: loginData,
    })

    if (response.data.value?.data?.token) {
      token.value = response.data.value?.data.token
    }

    if (response.data.value?.data?.user) {
      user.value = response.data.value?.data.user
    }

    return response
  }

  const register = async (data: RegisterData) => {
    const response = await useApi<MessageResponse>('auth/register', {
      method: 'POST',
      body: data,
    })

    return response
  }

  const verify = async (data: VerifyData) => {
    const response = await useApi<MessageResponse>(
      `auth/verify/${data.user}/${data.token}`,
      {
        method: 'POST',
      },
    )

    return response
  }

  const forgot = async (data: ForgotData) => {
    const response = await useApi<MessageResponse>('auth/forgot', {
      method: 'POST',
      body: data,
    })

    return response
  }

  const reset = async (data: ResetData) => {
    const response = await useApi<MessageResponse>('auth/reset', {
      method: 'POST',
      body: data,
    })

    return response
  }

  return {
    user,
    token,
    isLoggedIn,
    login,
    logout,
    register,
    verify,
    forgot,
    reset,
    getAuthUser,
  }
})
