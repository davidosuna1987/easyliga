import { Game, Profile, Team, mapApiGameToGame } from '@/domain/game'
import { Set, mapApiSetToSet } from '@/domain/set'
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
  comments: string | null
} & PointRelations

export const mapApiPointToPoint = (apiPoint: ApiPoint): Point => {
  const {
    id,
    set_id,
    previous_point_id,
    serving_team_id,
    serving_profile_id,
    scoring_profile_id,
    serve_number,
    winner_team_id,
    loser_team_id,
    local_team_score,
    visitor_team_score,
    comments,
    set,
    game,
    // serving_player,
    // scoring_player,
    // scoring_team,
    // winner_team,
    // loser_team,
    previous_point,
  } = apiPoint
  return {
    id,
    setId: set_id,
    previousPointId: previous_point_id,
    servingTeamId: serving_team_id,
    servingProfileId: serving_profile_id,
    scoringProfileId: scoring_profile_id,
    serveNumber: serve_number,
    winnerTeamId: winner_team_id,
    loserTeamId: loser_team_id,
    localTeamScore: local_team_score,
    visitorTeamScore: visitor_team_score,
    comments,
    set: set ? mapApiSetToSet(set) : undefined,
    game: game ? mapApiGameToGame(game) : undefined,
    // servingPlayer: serving_player ? mapApiProfileToProfile(serving_player) : undefined,
    // scoringPlayer: scoring_player ? mapApiProfileToProfile(scoring_player) : undefined,
    // scoringTeam: scoring_team ? mapApiTeamToTeam(scoring_team) : undefined,
    // winnerTeam: winner_team ? mapApiTeamToTeam(winner_team) : undefined,
    // loserTeam: loser_team ? mapApiTeamToTeam(loser_team) : undefined,
    previousPoint: previous_point
      ? mapApiPointToPoint(previous_point)
      : undefined,
  }
}
