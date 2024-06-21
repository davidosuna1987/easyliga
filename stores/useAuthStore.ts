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
  ApiRegisterByInviteRequest,
  ApiManagedModelsResponse,
  ApiManagedModelsMappedResponse,
  ApiManagedModelResponse,
  ApiManagedModelMappedResponse,
  ApiFreshResponse,
} from '@/types/api/auth'
import { ApiUser } from '@/types/api/user'
import { Profile } from '@/domain/profile'
import { mapApiProfileToProfile } from '@/domain/profile'
import { Role } from '@/domain/role'
import { ApiLicense } from '@/types/api/license'
import { LicensableModelType } from '@/domain/licensable'
import { ApiProfile } from 'types/api/profile'

export const useAuthStore = defineStore('auth', () => {
  const easyStorage = useEasyStorage()

  const STAFF_ROLES = ['admin', 'staff']

  const user = ref<ApiUser | null>(null)
  const profile = ref<Profile | null>(null)
  const profiles = ref<Profile[]>([])
  const roles = ref<Role[]>([])
  const licenses = ref<ApiLicense[]>([])
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

  const registerByInvite = async (
    invite: number,
    data: ApiRegisterByInviteRequest,
  ) => {
    const response = await useApi<ApiMessageResponse>(
      `auth/register-by-invite/${invite}`,
      {
        method: 'POST',
        body: data,
      },
    )

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

  const fresh = async () => {
    const { data } = await useApi<ApiFreshResponse>(`auth/fresh`)
    data.value && refreshData(data.value.data)
  }

  const managedModel = async (type: LicensableModelType) =>
    await useApi<ApiManagedModelResponse>(`auth/managed/${type}`)

  const managedModelMapped = async (type: LicensableModelType) =>
    await useApi<ApiManagedModelMappedResponse>(
      `auth/managed/${type}?mapped=true`,
    )

  const managedModels = async () =>
    await useApi<ApiManagedModelsResponse>('auth/managed/models')

  const managedModelsMapped = async () =>
    await useApi<ApiManagedModelsMappedResponse>(
      'auth/managed/models?mapped=true',
    )

  const refreshData = (data: ApiFreshData) => {
    user.value = data.user
    profile.value = mapApiProfileToProfile(data.profile)
    profiles.value = data.profiles.map(mapApiProfileToProfile)
    roles.value = data.roles
    licenses.value = data.licenses
  }

  const refreshToken = (data: ApiLoginData) => {
    token.value = data.token
  }

  const refreshLoginData = (data: ApiLoginData) => {
    refreshData(data)
    refreshToken(data)
  }

  const refreshProfile = (data: ApiProfile) => {
    profile.value = mapApiProfileToProfile(data)

    const index = profiles.value.findIndex(p => p.id === data.id)
    if (index !== -1) {
      profiles.value[index] = mapApiProfileToProfile(data)
    }
  }

  const isAdmin = () => roles.value.includes('admin')

  const isStaff = () => roles.value.some(role => STAFF_ROLES.includes(role))

  const isAdminOrHasRole = (searchedRole: Role) => {
    if (isAdmin()) return true
    return hasRole(searchedRole)
  }

  const isAdminOrHasAnyRole = (searchedRoles: string[]) => {
    if (isAdmin()) return true
    return hasAnyRole(searchedRoles)
  }

  const isStaffOrHasRole = (searchedRole: Role) => {
    if (isStaff()) return true
    return hasRole(searchedRole)
  }

  const isStaffOrHasAnyRole = (searchedRoles: string[]) => {
    if (isStaff()) return true
    return hasAnyRole(searchedRoles)
  }

  const hasRole = (searchedRole: Role) => roles.value.includes(searchedRole)

  const hasAnyRole = (searchedRoles: string[]) =>
    roles.value.some(role => searchedRoles.includes(role))

  const loginRedirect = () => {
    const storedLoginRedirect = easyStorage.get('loginRedirect')
    if (storedLoginRedirect) {
      easyStorage.remove('loginRedirect')
      return navigateTo(storedLoginRedirect)
    } else {
      if (!isLoggedIn) return navigateTo('/login')

      if (roles.value.includes('referee')) return navigateTo('/referee')
      if (roles.value.includes('coach')) return navigateTo('/coach')

      return navigateTo('/')
    }
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
    licenses,
    token,
    isLoggedIn,
    fresh,
    login,
    logout,
    register,
    registerByInvite,
    verify,
    forgot,
    reset,
    loginAs,
    managedModel,
    managedModelMapped,
    managedModels,
    managedModelsMapped,
    refreshData,
    refreshToken,
    refreshLoginData,
    refreshProfile,
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
