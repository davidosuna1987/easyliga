import {
  ApiCall,
  ApiCallObservationsRequest,
  ApiCallPlayersData,
  ApiCallSignRequest,
} from '@/types/api/call'
import { Game, mapApiGameToGame } from '@/domain/game'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { Player, mapApiPlayersToPlayers } from '@/domain/player'
import { Rotation, mapApiRotationToRotation } from '@/domain/rotation'
import { User, mapApiUserToUser } from '@/domain/user'

export const MIN_CALL_PLAYERS = 6
export const MAX_CALL_PLAYERS = 13
export const MAX_CALL_LIBERO_PLAYERS = 2

export type CallPlayerData = {
  profileId: number
  firstName: string
  lastName: string
  avatar?: string
  shirtNumber: number
  captain: boolean
  libero: boolean
}

export type CallRelations = {
  game?: Game
  team?: Team
  players?: Player[]
  coach?: User
  signingCoach?: User
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
  signingCoachId?: number
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
  locked: apiCall.locked ? true : false,
  observations: apiCall.observations ?? undefined,
  signingCoachId: apiCall.signing_coach_id ?? undefined,
  signedAt: apiCall.signed_at ?? undefined,

  ...mapApiCallRelationsToCallRelations(apiCall),
})

export const mapApiCallRelationsToCallRelations = (
  apiCall: ApiCall,
): CallRelations => ({
  game: apiCall.game ? mapApiGameToGame(apiCall.game) : undefined,
  team: apiCall.team ? mapApiTeamToTeam(apiCall.team) : undefined,
  players: mapApiPlayersToPlayers(apiCall.players),
  coach: apiCall.coach ? mapApiUserToUser(apiCall.coach) : undefined,
  signingCoach: apiCall.signing_coach
    ? mapApiUserToUser(apiCall.signing_coach)
    : undefined,
  rotations: apiCall.rotations
    ? apiCall.rotations.map(mapApiRotationToRotation)
    : [],
  currentRotation: apiCall.current_rotation
    ? mapApiRotationToRotation(apiCall.current_rotation)
    : undefined,
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
    captain: callPlayerData.captain ? true : false,
    libero: callPlayerData.libero ? true : false,
  }))

export const mapApiCallPlayerDataToCallPlayerData = (
  apiCallPlayerData: ApiCallPlayersData,
): CallPlayerData => ({
  profileId: apiCallPlayerData.profile_id,
  firstName: apiCallPlayerData.first_name,
  lastName: apiCallPlayerData.last_name,
  avatar: apiCallPlayerData.avatar ?? undefined,
  shirtNumber: apiCallPlayerData.shirt_number,
  captain: apiCallPlayerData.captain ? true : false,
  libero: apiCallPlayerData.libero ? true : false,
})

export const mapApiCallPlayersDataToCallPlayersData = (
  apiCallPlayersData: ApiCallPlayersData[],
): CallPlayerData[] =>
  apiCallPlayersData.map(mapApiCallPlayerDataToCallPlayerData)

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

export const getPlayerDataByProfileId = (
  playersData: CallPlayerData[],
  profileId?: number,
): CallPlayerData | undefined =>
  profileId ? playersData.find(p => p.profileId === profileId) : undefined
