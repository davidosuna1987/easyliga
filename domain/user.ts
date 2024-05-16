import { ApiUser } from '@/types/api/user'
import { Profile, mapApiProfileToProfile } from '@/domain/profile'

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
