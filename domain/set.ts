import { ApiSet } from '@/types/api/set'
import { Point, mapApiPointToPoint } from '@/domain/point'

export type SetSide = 'left' | 'right'

export type SetRelations = {
  lastPoint?: Point
  lastTwoPoints?: Point[]
}

export type Set = {
  id: number
  gameId: number
  number: number
  localTeamSide: SetSide | null
  visitorTeamSide: SetSide | null
  firstServeTeamId: number | null
  localTeamScore: number | null
  visitorTeamScore: number | null
  winnerTeamId: number | null
  loserTeamId: number | null
  start: string | null
  end: string | null
  comments: string | null
} & SetRelations

export const mapApiSetToSet = (apiSet: ApiSet): Set => ({
  id: apiSet.id,
  gameId: apiSet.game_id,
  number: apiSet.number,
  localTeamSide: apiSet.local_team_side,
  visitorTeamSide: apiSet.visitor_team_side,
  firstServeTeamId: apiSet.first_serve_team_id,
  localTeamScore: apiSet.local_team_score,
  visitorTeamScore: apiSet.visitor_team_score,
  winnerTeamId: apiSet.winner_team_id,
  loserTeamId: apiSet.loser_team_id,
  start: apiSet.start,
  end: apiSet.end,
  comments: apiSet.comments,

  lastPoint: apiSet.last_point
    ? mapApiPointToPoint(apiSet.last_point)
    : undefined,

  lastTwoPoints: apiSet.last_two_points
    ? apiSet.last_two_points.map(mapApiPointToPoint)
    : undefined,
})
