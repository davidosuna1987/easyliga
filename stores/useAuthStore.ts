import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import {
  AuthuserResponse,
  ForgotData,
  LoginData,
  LoginResponse,
  MessageResponse,
  Profile,
  RegisterData,
  ResetData,
  User,
  VerifyData,
} from '@/types/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const STAFF_ROLES = ['admin', 'staff']

  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const profiles = ref<Profile[]>([])
  const roles = ref<string[]>([])
  const token = ref<string | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  const getAuthUser = async () => {
    const response = await useApi<AuthuserResponse>('auth/user')
    user.value = response.data.value?.data.user as User
  }

  const login = async (loginData: LoginData) => {
    const response = await useApi<LoginResponse>('auth/login', {
      method: 'POST',
      body: loginData,
    })

    if (response.data.value?.data?.user) {
      user.value = response.data.value?.data.user
    }

    if (response.data.value?.data?.profile) {
      profile.value = response.data.value?.data.profile
    }

    if (response.data.value?.data?.profiles) {
      profiles.value = response.data.value?.data.profiles
    }

    if (response.data.value?.data?.roles) {
      roles.value = response.data.value?.data.roles
    }

    if (response.data.value?.data?.token) {
      token.value = response.data.value?.data.token
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

  const logout = async () => {
    await useApi<MessageResponse>('auth/logout', { method: 'POST' })
    setInitialState()
    navigateTo('/login')
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

  const isAdmin = () => roles.value.includes('admin')

  const isStaff = () => roles.value.some(role => STAFF_ROLES.includes(role))

  const isAdminOrHasRole = (searchedRole: string) => {
    if (isAdmin()) return true
    return hasRole(searchedRole)
  }

  const isAdminOrHasAnyRole = (searchedRoles: string[]) => {
    if (isAdmin()) return true
    return hasAnyRole(searchedRoles)
  }

  const isStaffOrHasRole = (searchedRole: string) => {
    if (isStaff()) return true
    return hasRole(searchedRole)
  }

  const isStaffOrHasAnyRole = (searchedRoles: string[]) => {
    if (isStaff()) return true
    return hasAnyRole(searchedRoles)
  }

  const hasRole = (searchedRole: string) => roles.value.includes(searchedRole)

  const hasAnyRole = (searchedRoles: string[]) =>
    roles.value.some(role => searchedRoles.includes(role))

  const setInitialState = () => {
    user.value = null
    profile.value = null
    profiles.value = []
    roles.value = []
    token.value = null
  }

  return {
    user,
    profile,
    profiles,
    roles,
    token,
    isLoggedIn,
    login,
    logout,
    register,
    verify,
    forgot,
    reset,
    getAuthUser,
    isAdmin,
    isStaff,
    isAdminOrHasRole,
    isAdminOrHasAnyRole,
    isStaffOrHasRole,
    isStaffOrHasAnyRole,
    hasRole,
    hasAnyRole,
  }
})
