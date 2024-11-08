import { ApiPlayer } from '@/types/api/auth'
import { CallPlayerData } from '@/domain/call'
import { ApiPlayerRequest } from '@/types/api/player'
import { Coach, TeamMember } from '@/domain/team'
import { Profile, mapApiProfileToProfile } from '@/domain/profile'
import { RotationPlayerStatus } from '@/domain/rotation'

export const ADD_PLAYER_STEPS = {
  search: 'search',
  invite: 'invite',
  create: 'create',
} as const

export type AddPlayerStep = keyof typeof ADD_PLAYER_STEPS

export type Player = {
  profileId: number
  firstName: string
  lastName: string
  shirtNumber: number
  avatar?: string
  captain: boolean
  libero: boolean
  profile?: Profile
  changeStatus?: RotationPlayerStatus
}

export type UpdateClubTeamPlayer =
  | {
      clubId: number
      teamId: number
    }
  | undefined

export const mapProfileToPlayer = (profile: Profile): Player => ({
  profileId: profile.id,
  firstName: profile.firstName,
  lastName: profile.lastName,
  shirtNumber: 0,
  avatar: profile.avatar,
  captain: false,
  libero: false,
  profile,
})

export const mapApiPlayersToPlayers = (
  apiPlayers: ApiPlayer[] | undefined,
  withProfiles: boolean = false,
): Player[] => {
  if (!apiPlayers) return []

  return apiPlayers.map(apiPlayer => ({
    profileId: apiPlayer.id,
    firstName: apiPlayer.first_name,
    lastName: apiPlayer.last_name,
    avatar: apiPlayer.avatar ?? undefined,
    shirtNumber: apiPlayer.pivot.shirt_number,
    captain: apiPlayer.pivot.captain,
    libero: apiPlayer.pivot.libero,
    profile: withProfiles ? mapApiProfileToProfile(apiPlayer) : undefined,
  }))
}

export const getFullName = (
  profile?: Profile | Player | CallPlayerData | TeamMember | Coach,
): string | undefined => {
  if (!profile) return undefined
  const { firstName, lastName } = profile
  return lastName ? `${firstName} ${lastName}` : firstName
}

export const mapCallPlayerDataToPlayer = (
  callPlayerData: CallPlayerData,
): Player => {
  return {
    profileId: callPlayerData.profileId,
    firstName: callPlayerData.firstName,
    lastName: callPlayerData.lastName,
    shirtNumber: callPlayerData.shirtNumber,
    avatar: callPlayerData.avatar,
    captain: callPlayerData.captain,
    libero: callPlayerData.libero,
  }
}

export const mapPlayerToApiPlayerRequest = (
  player: Player,
): ApiPlayerRequest => ({
  profile_id: player.profileId,
  shirt_number: player.shirtNumber,
  captain: player.captain,
  libero: player.libero,
})
