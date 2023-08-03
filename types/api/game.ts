import { ApiSede } from '@/types/api/sede'

export type ApiGame = {
  id: number
  league_id: number | null
  division_id: number | null
  club_id: number | null
  sede_id: number | null
  court_id: number | null
  referee_id: number | null
  local_team_id: number | null
  visitor_team_id: number | null
  date: string | null
  start: string | null
  end: string | null
  winner_team_id: number | null
  loser_team_id: number | null
  status: string | null
  comments: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}
export type ApiGameWithSedes = ApiGame & {
  sedes: ApiSede[]
}

export type ApiGameResponse = {
  success: boolean
  data: {
    game: ApiGame
  }
  errors: null
}

export type ApiGamesResponse = {
  success: boolean
  data: {
    games: ApiGame[]
  }
  errors: null
}

export type ApiGameStoreRequest = {
  league_id: number | null
  court_id: number | null
  referee_id: number | null
  local_team_id: number | null
  visitor_team_id: number | null
}
