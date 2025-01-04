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
import { ApiUser, ApiUserBillingPortalResponse } from '@/types/api/user'
import { Profile } from '@/domain/profile'
import { mapApiProfileToProfile } from '@/domain/profile'
import {
  mapApiRoleToRoleModel,
  Role,
  ROLE_MAPPER,
  RoleModel,
} from '@/domain/role'
import { ApiLicense } from '@/types/api/license'
import { LicensableModelType } from '@/domain/licensable'
import { ApiProfile } from '@/types/api/profile'
import { ApiTeamsResponse } from '@/types/api/team'
import {
  ApiAddressFormRequest,
  ApiBillingAddressResponse,
} from '@/types/api/billing_address'

export const useAuthStore = defineStore('auth', () => {
  const easyStorage = useEasyStorage()

  const STAFF_ROLES = ['admin', 'staff']

  const user = ref<ApiUser | null>(null)
  const profile = ref<Profile | null>(null)
  const profiles = ref<Profile[]>([])
  const roleModels = ref<RoleModel[]>([])
  const roles = ref<Role[]>([])
  const licenses = ref<ApiLicense[]>([])
  const refereeAdministratedFederationIds = ref<number[]>([])
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
      `auth/verify/${data.user_id}/${data.token}`,
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

  const coachedTeams = async (params?: Record<string, string>) =>
    await useApi<ApiTeamsResponse>('auth/coached-teams', {
      params,
    })

  const hasRole = (searchedRole: Role) =>
    /* searchedRole === ROLE_MAPPER.referee_admin
      ? refereeAdministratedFederationIds.value.length > 0 &&
        roles.value.includes(searchedRole)
      :  */ roles.value.includes(searchedRole)

  const hasAnyRole = (searchedRoles: Role[]) =>
    roles.value.some(role => searchedRoles.includes(role))

  const removeRefereeAdminRoleIfNoAdministratedFederations = () => {
    if (
      roles.value.includes(ROLE_MAPPER.referee_admin) &&
      !refereeAdministratedFederationIds.value.length
    ) {
      roles.value = roles.value.filter(
        role => role !== ROLE_MAPPER.referee_admin,
      )
      roleModels.value = roleModels.value.filter(
        role => role.name !== ROLE_MAPPER.referee_admin,
      )
    }
  }

  const refreshData = (data: ApiFreshData) => {
    user.value = data.user
    profile.value = mapApiProfileToProfile(data.profile)
    profiles.value = data.profiles.map(mapApiProfileToProfile)
    roles.value = data.roles.map(mapApiRoleToRoleModel).map(r => r.name)
    roleModels.value = data.roles.map(mapApiRoleToRoleModel)
    refereeAdministratedFederationIds.value =
      data.roles.find(role => role.name === ROLE_MAPPER.referee_admin)?.pivot
        .meta?.administrated_federation_ids || []
    licenses.value = data.licenses

    removeRefereeAdminRoleIfNoAdministratedFederations()
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

  const isAdmin = () => roles.value.includes(ROLE_MAPPER.admin)

  const isStaff = () => roles.value.some(role => STAFF_ROLES.includes(role))

  const isAdminOrHasRole = (searchedRole: Role) => {
    if (isAdmin()) return true
    return hasRole(searchedRole)
  }

  const isAdminOrHasAnyRole = (searchedRoles: Role[]) => {
    if (isAdmin()) return true
    return hasAnyRole(searchedRoles)
  }

  const isStaffOrHasRole = (searchedRole: Role) => {
    if (isStaff()) return true
    return hasRole(searchedRole)
  }

  const isStaffOrHasAnyRole = (searchedRoles: Role[]) => {
    if (isStaff()) return true
    return hasAnyRole(searchedRoles)
  }

  const loginRedirect = () => {
    const storedLoginRedirect = easyStorage.get('loginRedirect')
    if (storedLoginRedirect) {
      easyStorage.remove('loginRedirect')
      navigateTo(storedLoginRedirect)
    } else {
      if (!isLoggedIn.value) return navigateTo('/login')

      if (hasRole(ROLE_MAPPER.admin)) return navigateTo('/admin')
      if (hasRole(ROLE_MAPPER.referee)) return navigateTo('/referee')
      if (hasRole(ROLE_MAPPER.coach)) return navigateTo('/coach')
      if (hasRole(ROLE_MAPPER.club)) return navigateTo('/club')
      if (hasRole(ROLE_MAPPER.federation)) return navigateTo('/federation')
      if (hasRole(ROLE_MAPPER.referee_admin))
        return navigateTo('/referee/admin')

      return navigateTo('/')
    }
  }

  const getBillingPortalUrl = async () => {
    const response = await useApi<ApiUserBillingPortalResponse>(
      `auth/billing-portal-url`,
    )

    return response.data.value?.data?.url
  }

  const getBillingAddress = async () => {
    const response = await useApi<ApiBillingAddressResponse>(
      `auth/billing-address`,
    )

    return response.data.value?.data?.billing_address
  }

  const setBillingAddress = async (data: ApiAddressFormRequest) => {
    const response = await useApi<ApiLoginResponse>('auth/billing-address', {
      method: 'POST',
      body: data,
    })

    return response
  }

  const setInitialState = () => {
    user.value = null
    profile.value = null
    profiles.value = []
    roleModels.value = []
    roles.value = []
    refereeAdministratedFederationIds.value = []
    token.value = null
  }

  return {
    user,
    profile,
    profiles,
    roleModels,
    roles,
    refereeAdministratedFederationIds,
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
    coachedTeams,
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
    getBillingPortalUrl,
    getBillingAddress,
    setBillingAddress,
    setInitialState,
  }
})
