import {
  ApiCall,
  ApiCallObservationsRequest,
  ApiCallPlayersData,
  ApiCallSignRequest,
} from '@/types/api/call'
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
  observations?: string
  signedAt?: string
} & CallRelations

export type CallObservationsRequest = {
  observations?: string
}

export type CallSignRequest = {
  signedAt?: string
}

export const mapApiCallToCall = (apiCall: ApiCall): Call => ({
  id: apiCall.id,
  gameId: apiCall.game_id,
  teamId: apiCall.team_id,
  playersData: mapApiCallPlayersDataToCallPlayersData(apiCall.players_data),
  currentRotation: apiCall.current_rotation
    ? mapApiRotationToRotation(apiCall.current_rotation)
    : undefined,
  locked: apiCall.locked,
  observations: apiCall.observations ?? undefined,
  signedAt: apiCall.signed_at ?? undefined,
})

export const mapCallPlayersDataToPlayers = (
  callPlayersData: CallPlayerData[],
): Player[] =>
  callPlayersData.map(callPlayerData => ({
    profileId: callPlayerData.profileId,
    firstName: callPlayerData.firstName,
    lastName: callPlayerData.lastName,
    shirtNumber: callPlayerData.shirtNumber,
    avatar: callPlayerData.avatar,
    captain: callPlayerData.captain,
    libero: callPlayerData.libero,
  }))

export const mapApiCallPlayersDataToCallPlayersData = (
  apiCallPlayersData: ApiCallPlayersData[],
): CallPlayerData[] =>
  apiCallPlayersData.map(apiCallPlayerData => ({
    profileId: apiCallPlayerData.profile_id,
    firstName: apiCallPlayerData.first_name,
    lastName: apiCallPlayerData.last_name,
    avatar: apiCallPlayerData.avatar,
    shirtNumber: apiCallPlayerData.shirt_number,
    captain: apiCallPlayerData.captain,
    libero: apiCallPlayerData.libero,
  }))

export const mapCallObservationsRequestToApiCallObservationsRequest = (
  callObservationsRequest: CallObservationsRequest,
): ApiCallObservationsRequest => ({
  observations: callObservationsRequest.observations ?? null,
})

export const mapCallSignRequestToApiCallSignRequest = (
  callSignRequest: CallSignRequest,
): ApiCallSignRequest => ({
  signed_at: callSignRequest.signedAt ?? null,
})

export const getProfileIdsFromCallPlayersData = (
  callPlayersData: CallPlayerData[],
) => callPlayersData.map(callPlayerData => callPlayerData.profileId)

export const getCaptainIdFromCallPlayersData = (
  callPlayersData: CallPlayerData[],
) => callPlayersData.find(p => p.captain)?.profileId ?? 0

export const getLiberoIdFromCallPlayersData = (
  callPlayersData: CallPlayerData[],
) => callPlayersData.find(p => p.libero)?.profileId ?? 0
