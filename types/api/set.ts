import { SetSide } from '@/domain/set'
import { ApiPoint } from '@/types/api/point'
import { ApiRotation } from '@/types/api/rotation'
import { ApiTimeout } from '@/types/api/timeout'
import { ApiSanction } from '@/types/api/sanction'
import { ApiDuration } from '@/types/api/utils'

export type ApiSetRelations = {
  last_point?: ApiPoint
  last_two_points?: ApiPoint[]
  rotations?: ApiRotation[]
  timeouts?: ApiTimeout[]
  sanctions?: ApiSanction[]
  game_sanctions?: ApiSanction[]
}

export type ApiSetRelationsCount = {
  rotations_count?: number
  timeouts_count?: number
  sanctions_count?: number
  game_sanctions_count?: number
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
  duration: ApiDuration | null
  observations: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiSetRelations &
  ApiSetRelationsCount

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

export type ApiSetTeamIncompleteResponse = {
  success: boolean
  data: {
    incomplete: {
      game: boolean
      set: boolean
    }
  }
  errors: null
}
