import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import {
  AuthuserResponse,
  ForgotData,
  LoginData,
  LoginResponse,
  MessageResponse,
  RegisterData,
  ResetData,
  User,
  VerifyData,
} from 'types/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  const logout = async () => {
    await useApi<MessageResponse>('auth/logout', { method: 'POST' })
    setInitialState()
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

  const setInitialState = () => {
    user.value = null
    token.value = null
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
