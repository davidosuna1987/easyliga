import { ApiPlayer } from '@/types/api/auth'
import { CallPlayerData } from '@/domain/call'
import { ApiPlayerRequest } from '@/types/api/player'

export type Player = {
  profileId: number
  firstName: string
  lastName?: string | null
  shirtNumber: number
  avatar?: string | null
  captain: boolean
  libero: boolean
}

export const mapApiPlayersToPlayers = (
  apiPlayers: ApiPlayer[] | undefined,
): Player[] => {
  if (!apiPlayers) return []

  return apiPlayers.map(apiPlayer => ({
    profileId: apiPlayer.id,
    firstName: apiPlayer.first_name,
    lastName: apiPlayer.last_name ?? undefined,
    avatar: apiPlayer.avatar ?? undefined,
    shirtNumber: apiPlayer.pivot.shirt_number,
    captain: apiPlayer.pivot.captain,
    libero: apiPlayer.pivot.libero,
  }))
}

export const getFullName = (player: Player | CallPlayerData): string => {
  const { firstName, lastName } = player
  return lastName ? `${firstName} ${lastName}` : firstName
}

export const mapCallPlayerDataToPlayers = (
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
