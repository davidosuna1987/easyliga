import { ApiProfile } from '@/types/api/profile'
import { ApiGame } from '@/types/api/game'
import { ApiSet } from '@/types/api/set'
import { ApiTeam } from '@/types/api/team'

export type ApiPointRelations = {
  set?: ApiSet
  game?: ApiGame
  serving_player?: ApiProfile
  scoring_player?: ApiProfile
  scoring_team?: ApiTeam
  winner_team?: ApiTeam
  loser_team?: ApiTeam
  previous_point?: ApiPoint
}

export type ApiPoint = {
  id: number
  set_id: number
  previous_point_id: number | null
  serving_team_id: number
  serving_profile_id: number | null
  scoring_profile_id: number | null
  serve_number: number
  winner_team_id: number
  loser_team_id: number
  local_team_score: number
  visitor_team_score: number
  start: string | null
  end: string | null
  observations: string | null
} & ApiPointRelations

export type ApiPointStoreRequest = {
  set_id: number
  previous_point_id: number | null
  serving_team_id: number
  serving_profile_id: number | null
  scoring_profile_id: number | null
  serve_number?: number
  winner_team_id: number
  loser_team_id: number
  local_team_score: number
  visitor_team_score: number
  observations: string | null
}

export type ApiPointResponse = {
  success: boolean
  data: ApiPoint
  errors: null
}
