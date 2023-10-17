import { SetSide } from '@/domain/set'
import { ApiPoint } from '@/types/api/point'
import { ApiRotation } from '@/types/api/rotation'
import { ApiTimeout } from '@/types/api/timeout'

export type ApiSetRelations = {
  last_point?: ApiPoint
  last_two_points?: ApiPoint[]
  rotations?: ApiRotation[]
  timeouts?: ApiTimeout[]
}

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
  observations: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiSetRelations

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

export type ApiSetStartRequest = {
  local_team_side: SetSide
  visitor_team_side: SetSide
  first_serve_team_id: number
}
