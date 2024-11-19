import { ApiUser } from '@/types/api/user'
import { Profile, Responsible, mapApiProfileToProfile } from '@/domain/profile'
import { mapApiRoleToRole, Role } from '@/domain/role'
import { Federation, mapApiFederationToFederation } from '@/domain/federation'
import { Club, mapApiClubToClub } from '@/domain/club'
import { mapApiSedeToSede, Sede } from '@/domain/sede'
import { License, mapApiLicenseToLicense } from '@/domain/license'
import { ApiFederationRefereePivot } from '@/types/api/federation'

export type UserPivot = ApiFederationRefereePivot

export type UserRelations = {
  profile?: Profile
  roles?: Role[]
  refereeFederations?: Federation[]
  adminRefereeFederations?: Federation[]
  managedFederations?: Federation[]
  managedClubs?: Club[]
  managedSedes?: Sede[]
  licenses?: License[]
}

export type User = {
  id: number
  email: string
  pivot?: UserPivot
} & UserRelations

export type UserSearchFormInputRef = {
  editingUser: boolean
  userChanged: boolean
  stopEditing: () => void
  clear: () => void
}

export type UserSearchFormRef = {
  clear: () => void
}

export const mapApiUserToUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  email: apiUser.email,
  pivot: apiUser.pivot,

  ...mapApiUserRelationsToUserRelations(apiUser),
})

export const mapApiUserRelationsToUserRelations = (
  apiUser: ApiUser,
): UserRelations => ({
  profile: apiUser.profile
    ? mapApiProfileToProfile(apiUser.profile)
    : undefined,
  roles: apiUser.roles ? apiUser.roles.map(mapApiRoleToRole) : undefined,
  refereeFederations: apiUser.referee_federations
    ? apiUser.referee_federations.map(mapApiFederationToFederation)
    : undefined,
  adminRefereeFederations: apiUser.admin_referee_federations
    ? apiUser.admin_referee_federations.map(mapApiFederationToFederation)
    : undefined,
  managedFederations: apiUser.managed_federations
    ? apiUser.managed_federations.map(mapApiFederationToFederation)
    : undefined,
  managedClubs: apiUser.managed_clubs
    ? apiUser.managed_clubs.map(mapApiClubToClub)
    : undefined,
  managedSedes: apiUser.managed_sedes
    ? apiUser.managed_sedes.map(mapApiSedeToSede)
    : undefined,
  licenses: apiUser.licenses
    ? apiUser.licenses.map(mapApiLicenseToLicense)
    : undefined,
})

export const mapApiUserToResponsible = (
  apiUser: ApiUser,
): Responsible | undefined => {
  if (!apiUser.profile) return undefined

  return {
    id: apiUser.profile.id,
    firstName: apiUser.profile.first_name,
    lastName: apiUser.profile.last_name,
    email: apiUser.profile.email,
    phone: apiUser.profile.phone || undefined,
    avatar: apiUser.profile.avatar || undefined,
  }
}
