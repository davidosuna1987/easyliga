import { ApiUser } from '@/types/api/user'
import { Profile, Responsible, mapApiProfileToProfile } from '@/domain/profile'
import { mapApiRoleToRole, Role } from '@/domain/role'

export type UserRelations = {
  profile?: Profile
  roles?: Role[]
}

export type User = {
  id: number
  email: string
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

  ...mapApiUserRelationsToUserRelations(apiUser),
})

export const mapApiUserRelationsToUserRelations = (
  apiUser: ApiUser,
): UserRelations => ({
  profile: apiUser.profile
    ? mapApiProfileToProfile(apiUser.profile)
    : undefined,
  roles: apiUser.roles ? apiUser.roles.map(mapApiRoleToRole) : undefined,
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
