import { Player } from '@/domain/game'

export type ApiCallPlayersData = {
  profile_id: number
  first_name: string
  last_name: string | null
  avatar: string | null
  shirt_number: number
  libero: boolean
  captain: boolean
}

export type ApiCall = {
  id: number
  game_id: number
  team_id: number
  players_data: ApiCallPlayersData[]
  locked: boolean
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

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

export type ApiCallResponse = {
  success: boolean
  data: {
    call: ApiCall
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
