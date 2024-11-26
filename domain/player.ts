import { ApiPlayer } from '@/types/api/player'
import { CallPlayerData } from '@/domain/call'
import { ApiPlayerRequest, ApiPlayerStoreRequest } from '@/types/api/player'
import { Coach, TeamMember } from '@/domain/team'
import {
  Profile,
  mapApiProfileToProfile,
  mapDateToApiDate,
} from '@/domain/profile'
import { RotationPlayerStatus } from '@/domain/rotation'
import { UserStoreRequest } from '@/domain/user'

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

export type PlayerStoreRequest = UserStoreRequest & {
  shirtNumber: number
  captain: boolean
  libero: boolean
}

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

export const mapApiPlayerToPlayer = (
  apiPlayer: ApiPlayer,
  withProfile: boolean = false,
): Player => ({
  profileId: apiPlayer.id,
  firstName: apiPlayer.first_name,
  lastName: apiPlayer.last_name,
  shirtNumber: apiPlayer.pivot.shirt_number,
  avatar: apiPlayer.avatar ?? undefined,
  captain: apiPlayer.pivot.captain,
  libero: apiPlayer.pivot.libero,
  profile: withProfile ? mapApiProfileToProfile(apiPlayer) : undefined,
})

export const mapApiPlayersToPlayers = (
  apiPlayers: ApiPlayer[] | undefined,
  withProfiles: boolean = false,
): Player[] => {
  if (!apiPlayers) return []

  return apiPlayers.map(apiPlayer =>
    mapApiPlayerToPlayer(apiPlayer, withProfiles),
  )
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

export const mapPlayerStoreRequestToApiPlayerStoreRequest = (
  request: PlayerStoreRequest,
): ApiPlayerStoreRequest => ({
  allow_empty_email: request.allowEmptyEmail,
  email: request.email,
  first_name: request.firstName,
  last_name: request.lastName,
  birth_date: request.birthDate
    ? mapDateToApiDate(request.birthDate)
    : undefined,
  gender: request.gender,
  shirt_number: request.shirtNumber,
  captain: request.captain,
  libero: request.libero,
})
