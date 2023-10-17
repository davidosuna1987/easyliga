import { Game, mapApiGameToGame } from '@/domain/game'
import { Set, mapApiSetToSet } from '@/domain/set'
import { Team } from '@/domain/team'
import { Profile } from '@/domain/profile'
import { ApiPoint } from '@/types/api/point'

export type PointRelations = {
  set?: Set
  game?: Game
  servingPlayer?: Profile
  scoringPlayer?: Profile
  scoringTeam?: Team
  winnerTeam?: Team
  loserTeam?: Team
  previousPoint?: Point
}

export type Point = {
  id: number
  setId: number
  previousPointId: number | null
  servingTeamId: number
  servingProfileId: number | null
  scoringProfileId: number | null
  serveNumber: number
  winnerTeamId: number
  loserTeamId: number
  localTeamScore: number
  visitorTeamScore: number
  start: string | null
  end: string | null
  observations: string | null
} & PointRelations

export const mapApiPointToPoint = (apiPoint: ApiPoint): Point => ({
  id: apiPoint.id,
  setId: apiPoint.set_id,
  previousPointId: apiPoint.previous_point_id,
  servingTeamId: apiPoint.serving_team_id,
  servingProfileId: apiPoint.serving_profile_id,
  scoringProfileId: apiPoint.scoring_profile_id,
  serveNumber: apiPoint.serve_number,
  winnerTeamId: apiPoint.winner_team_id,
  loserTeamId: apiPoint.loser_team_id,
  localTeamScore: apiPoint.local_team_score,
  visitorTeamScore: apiPoint.visitor_team_score,
  start: apiPoint.start,
  end: apiPoint.end,
  observations: apiPoint.observations,

  set: apiPoint.set ? mapApiSetToSet(apiPoint.set) : undefined,
  game: apiPoint.game ? mapApiGameToGame(apiPoint.game) : undefined,
  // servingPlayer: serving_player ? mapApiProfileToProfile(serving_player) : undefined,
  // scoringPlayer: scoring_player ? mapApiProfileToProfile(scoring_player) : undefined,
  // scoringTeam: scoring_team ? mapApiTeamToTeam(scoring_team) : undefined,
  // winnerTeam: winner_team ? mapApiTeamToTeam(winner_team) : undefined,
  // loserTeam: loser_team ? mapApiTeamToTeam(loser_team) : undefined,
  previousPoint: apiPoint.previous_point
    ? mapApiPointToPoint(apiPoint.previous_point)
    : undefined,
})
