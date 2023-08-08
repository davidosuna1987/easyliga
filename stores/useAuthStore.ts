import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import {
  AuthuserResponse,
  ForgotData,
  LoginData,
  LoginResponse,
  ApiMessageResponse,
  ApiProfile,
  RegisterData,
  ResetData,
  ApiUser,
  VerifyData,
} from '@/types/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const STAFF_ROLES = ['admin', 'staff']

  const user = ref<ApiUser | null>(null)
  const profile = ref<ApiProfile | null>(null)
  const profiles = ref<ApiProfile[]>([])
  const roles = ref<string[]>([])
  const token = ref<string | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  const getAuthUser = async () => {
    const response = await useApi<AuthuserResponse>('auth/user')
    user.value = response.data.value?.data.user as ApiUser
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
    const response = await useApi<ApiMessageResponse>('auth/register', {
      method: 'POST',
      body: data,
    })

    return response
  }

  const verify = async (data: VerifyData) => {
    const response = await useApi<ApiMessageResponse>(
      `auth/verify/${data.user}/${data.token}`,
      {
        method: 'POST',
      },
    )

    return response
  }

  const logout = async () => {
    await useApi<ApiMessageResponse>('auth/logout', { method: 'POST' })
    setInitialState()
    navigateTo('/login')
  }

  const forgot = async (data: ForgotData) => {
    const response = await useApi<ApiMessageResponse>('auth/forgot', {
      method: 'POST',
      body: data,
    })

    return response
  }

  const reset = async (data: ResetData) => {
    const response = await useApi<ApiMessageResponse>('auth/reset', {
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

  const loginRedirect = () => {
    if (!isLoggedIn) return navigateTo('/login')

    if (roles.value.includes('referee')) return navigateTo('/referee')

    return navigateTo('/')
  }

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
    loginRedirect,
    setInitialState,
  }
})
