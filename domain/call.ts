import { ApiCall, ApiCallPlayersData } from '@/types/api/call'
import { Game } from '@/domain/game'
import { Team } from '@/domain/team'
import { Player } from '@/domain/player'
import { Rotation, mapApiRotationToRotation } from '@/domain/rotation'

export const MIN_CALL_PLAYERS = 6
export const MAX_CALL_PLAYERS = 12
export const MAX_CALL_LIBERO_PLAYERS = 2

export type CallPlayerData = {
  profileId: number
  firstName: string
  lastName: string | null
  avatar: string | null
  shirtNumber: number
  captain: boolean
  libero: boolean
}

export type CallRelations = {
  game?: Game
  team?: Team
  players?: Player[]
  rotations?: Rotation[]
  currentRotation?: Rotation
}

export type Call = {
  id: number
  gameId: number
  teamId: number
  playersData: CallPlayerData[]
  locked: boolean
} & CallRelations

export const mapApiCallToCall = (apiCall: ApiCall): Call => {
  return {
    id: apiCall.id,
    gameId: apiCall.game_id,
    teamId: apiCall.team_id,
    playersData: mapApiCallPlayersDataToCallPlayersData(apiCall.players_data),
    currentRotation: apiCall.current_rotation
      ? mapApiRotationToRotation(apiCall.current_rotation)
      : undefined,
    locked: apiCall.locked,
  }
}

export const mapCallPlayersDataToPlayers = (
  callPlayersData: CallPlayerData[],
): Player[] => {
  return callPlayersData.map(callPlayerData => {
    return {
      profileId: callPlayerData.profileId,
      firstName: callPlayerData.firstName,
      lastName: callPlayerData.lastName,
      shirtNumber: callPlayerData.shirtNumber,
      avatar: callPlayerData.avatar,
      captain: callPlayerData.captain,
      libero: callPlayerData.libero,
    }
  })
}

export const mapApiCallPlayersDataToCallPlayersData = (
  apiCallPlayersData: ApiCallPlayersData[],
): CallPlayerData[] => {
  return apiCallPlayersData.map(apiCallPlayerData => {
    return {
      profileId: apiCallPlayerData.profile_id,
      firstName: apiCallPlayerData.first_name,
      lastName: apiCallPlayerData.last_name,
      avatar: apiCallPlayerData.avatar,
      shirtNumber: apiCallPlayerData.shirt_number,
      captain: apiCallPlayerData.captain,
      libero: apiCallPlayerData.libero,
    }
  })
}

export const getProfileIdsFromCallPlayersData = (
  callPlayersData: CallPlayerData[],
) => callPlayersData.map(callPlayerData => callPlayerData.profileId)

export const getCaptainIdFromCallPlayersData = (
  callPlayersData: CallPlayerData[],
) => callPlayersData.find(p => p.captain)?.profileId ?? 0

export const getLiberoIdFromCallPlayersData = (
  callPlayersData: CallPlayerData[],
) => callPlayersData.find(p => p.libero)?.profileId ?? 0
