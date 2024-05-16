import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import {
  AuthuserResponse,
  ApiForgotRequest,
  ApiLoginRequest,
  ApiLoginResponse,
  ApiMessageResponse,
  ApiRegisterRequest,
  ApiResetRequest,
  ApiVerifyRequest,
  ApiFreshData,
  ApiLoginData,
  ApiLoginAsRequest,
} from '@/types/api/auth'
import { ApiUser } from '@/types/api/user'
import { Profile } from '@/domain/profile'
import { mapApiProfileToProfile } from '@/domain/profile'

export const useAuthStore = defineStore('auth', () => {
  const easyStorage = useEasyStorage()

  const STAFF_ROLES = ['admin', 'staff']

  const user = ref<ApiUser | null>(null)
  const profile = ref<Profile | null>(null)
  const profiles = ref<Profile[]>([])
  const roles = ref<string[]>([])
  const token = ref<string | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  const getAuthUser = async () => {
    const response = await useApi<AuthuserResponse>('auth/user')
    user.value = response.data.value?.data.user as ApiUser
  }

  const login = async (data: ApiLoginRequest) => {
    const response = await useApi<ApiLoginResponse>('auth/login', {
      method: 'POST',
      body: data,
    })

    if (response.data?.value?.data) {
      refreshData(response.data.value.data)
      refreshToken(response.data.value.data)
    }

    return response
  }

  const register = async (data: ApiRegisterRequest) => {
    const response = await useApi<ApiMessageResponse>('auth/register', {
      method: 'POST',
      body: data,
    })

    return response
  }

  const verify = async (data: ApiVerifyRequest) => {
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

  const forgot = async (data: ApiForgotRequest) => {
    const response = await useApi<ApiMessageResponse>('auth/forgot', {
      method: 'POST',
      body: data,
    })

    return response
  }

  const reset = async (data: ApiResetRequest) => {
    const response = await useApi<ApiMessageResponse>('auth/reset', {
      method: 'POST',
      body: data,
    })

    return response
  }

  const loginAs = async (data: ApiLoginAsRequest) => {
    const response = await useApi<ApiLoginResponse>('auth/loginas', {
      method: 'POST',
      body: data,
    })

    if (response.data?.value?.data) {
      refreshData(response.data.value.data)
      refreshToken(response.data.value.data)
    }

    return response
  }

  const refreshData = (data: ApiFreshData) => {
    user.value = data.user
    profile.value = mapApiProfileToProfile(data.profile)
    profiles.value = data.profiles.map(mapApiProfileToProfile)
    roles.value = data.roles
  }

  const refreshToken = (data: ApiLoginData) => {
    token.value = data.token
  }

  const refreshLoginData = (data: ApiLoginData) => {
    refreshData(data)
    refreshToken(data)
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

    const storedLoginRedirect = easyStorage.get('loginRedirect')
    if (storedLoginRedirect) {
      easyStorage.remove('loginRedirect')
      return navigateTo(storedLoginRedirect)
    }

    if (roles.value.includes('referee')) return navigateTo('/referee')
    if (roles.value.includes('coach')) return navigateTo('/coach')

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
    loginAs,
    refreshData,
    refreshToken,
    refreshLoginData,
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
