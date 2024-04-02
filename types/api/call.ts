import { Player } from '@/domain/player'
import { ApiTeam } from '@/types/api/team'
import { ApiGame } from '@/types/api/game'
import { ApiPlayer, ApiUser } from '@/types/api/auth'
import { ApiRotation } from '@/types/api/rotation'

export type ApiCallPlayersData = {
  profile_id: number
  first_name: string
  last_name: string
  avatar: string | null
  shirt_number: number
  libero: boolean
  captain: boolean
}

export type ApiCallRelations = {
  game?: ApiGame
  team?: ApiTeam
  players?: ApiPlayer[]
  coach?: ApiUser
  rotations?: ApiRotation[]
  current_rotation?: ApiRotation
}

export type ApiCall = {
  id: number
  game_id: number
  team_id: number
  players_data: ApiCallPlayersData[]
  locked: boolean
  observations: string | null
  signed_at: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiCallRelations

export type ApiCallRequestPlayer = {
  profile_id: number
  shirt_number: number
  captain: boolean
  libero: boolean
}

export type ApiCallStoreRequest = {
  game_id: number
  team_id: number
  players: ApiCallRequestPlayer[]
}

export type ApiCallUpdateRequest = {
  players: ApiCallRequestPlayer[]
}

export type ApiCallObservationsRequest = {
  observations: string | null
}

export type ApiCallSignRequest = {
  signed_at: string | null
}

export type ApiCallResponse = {
  success: boolean
  data: {
    call: ApiCall
  }
  errors: null
}

export type ApiCallsResponse = {
  success: boolean
  data: {
    calls: ApiCall[]
  }
  errors: null
}

export const mapPlayersToApiCallRequestPlayers = (
  players: Player[],
): ApiCallRequestPlayer[] => {
  return players.map(player => {
    return {
      profile_id: player.profileId,
      shirt_number: player.shirtNumber,
      captain: player.captain,
      libero: player.libero,
    }
  })
}
