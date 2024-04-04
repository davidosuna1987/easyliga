import { Game, mapApiGameToGame } from '@/domain/game'
import { Profile, mapApiProfileToProfile } from '@/domain/profile'
import { Team, TeamType, mapApiTeamToTeam } from '@/domain/team'
import { User, mapApiUserToUser } from '@/domain/user'
import {
  ApiGameSignature,
  ApiGameSignatureStoreRequest,
} from '@/types/api/game-signature'

export const GameSignatureTypes = {
  referee: 'referee',
  coach: 'coach',
  captain: 'captain',
} as const

export type GameSignatureType =
  (typeof GameSignatureTypes)[keyof typeof GameSignatureTypes]

export const REQUIRED_TEAM_ID_SIGNATURE_TYPES: GameSignatureType[] = [
  GameSignatureTypes.coach,
  GameSignatureTypes.captain,
]

export type GameSignatureRelations = {
  game?: Game
  team?: Team
  profile?: Profile
  user?: User
}

export type GameSignature = {
  gameId: number
  teamId?: number
  profileId: number
  type: GameSignatureType
  signature: string
} & GameSignatureRelations

export type GameSignatureStoreRequest = {
  type: GameSignatureType
  signature: string
  teamType?: TeamType
}

export const mapApiGameSignatureToGameSignature = (
  apiGameSignature: ApiGameSignature,
): GameSignature => ({
  gameId: apiGameSignature.game_id,
  teamId: apiGameSignature.team_id ?? undefined,
  profileId: apiGameSignature.profile_id,
  type: apiGameSignature.type,
  signature: apiGameSignature.signature,
  game: apiGameSignature.game
    ? mapApiGameToGame(apiGameSignature.game)
    : undefined,
  team: apiGameSignature.team
    ? mapApiTeamToTeam(apiGameSignature.team)
    : undefined,
  profile: apiGameSignature.profile
    ? mapApiProfileToProfile(apiGameSignature.profile)
    : undefined,
  user: apiGameSignature.user
    ? mapApiUserToUser(apiGameSignature.user)
    : undefined,
})

export const mapGameSignatureStoreRequestToApiGameSignatureStoreRequest = (
  gameSignature: GameSignatureStoreRequest,
): ApiGameSignatureStoreRequest => ({
  type: gameSignature.type,
  signature: gameSignature.signature,
  team_type: gameSignature.teamType,
})

export const getSignatureByType = (
  gameSignatures: GameSignature[],
  type: GameSignatureType,
  teamId?: number,
): GameSignature | undefined =>
  gameSignatures.find(
    gameSignature =>
      gameSignature.type === type &&
      (!teamId || gameSignature.teamId === teamId),
  )
