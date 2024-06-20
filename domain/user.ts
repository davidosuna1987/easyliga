import { ApiUser } from '@/types/api/user'
import { Profile, Responsible, mapApiProfileToProfile } from '@/domain/profile'

export type UserRelations = {
  profile?: Profile
}

export type User = {
  id: number
  email: string
} & UserRelations

export const mapApiUserToUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  email: apiUser.email,

  profile: apiUser.profile
    ? mapApiProfileToProfile(apiUser.profile)
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
