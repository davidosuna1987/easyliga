import { SetSide } from '@/domain/set'

export type ApiSet = {
  id: number
  game_id: number
  number: number
  local_team_side: SetSide | null
  visitor_team_side: SetSide | null
  first_serve_team_id: number | null
  local_team_score: number | null
  visitor_team_score: number | null
  winner_team_id: number | null
  loser_team_id: number | null
  start: string | null
  end: string | null
  comments: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export type ApiSetResponse = {
  success: boolean
  data: {
    set: ApiSet
  }
  errors: null
}

export type ApiSetsResponse = {
  success: boolean
  data: {
    sets: ApiSet[]
  }
  errors: null
}
