export type ApiCallPlayersData = {
  profile_id: number
  first_name: string
  last_name: string | null
  avatar: string | null
  shirt_number: number | null
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

export type ApiCallStoreRequest = {
  game_id: number
  team_id: number
  profile_ids: number[]
}

export type ApiCallUpdateRequest = {
  profile_ids: number[]
  captain_id: number
  libero_id: number
}

export type ApiCallResponse = {
  success: boolean
  data: {
    call: ApiCall
  }
  errors: null
}
