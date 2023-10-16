import { ApiSet, ApiSetStartRequest } from '@/types/api/set'
import { Point, mapApiPointToPoint } from '@/domain/point'
import { Rotation, mapApiRotationToRotation } from '@/domain/rotation'
import { Timeout, mapApiTimeoutToTimeout } from '@/domain/timeout'

export enum SetSide {
  LEFT = 'left',
  RIGHT = 'right',
}

export type SetRelations = {
  lastPoint?: Point
  lastTwoPoints?: Point[]
  rotations?: Rotation[]
  timeouts?: Timeout[]
}

export type Set = {
  id: number
  gameId: number
  number: number
  localTeamSide?: SetSide
  visitorTeamSide?: SetSide
  firstServeTeamId?: number
  localTeamScore?: number
  visitorTeamScore?: number
  winnerTeamId?: number
  loserTeamId?: number
  start?: string
  end?: string
  comments?: string
} & SetRelations

export type SetStartRequest = {
  localTeamSide: SetSide
  visitorTeamSide: SetSide
  firstServeTeamId: number
}

export const mapApiSetToSet = (apiSet: ApiSet): Set => ({
  id: apiSet.id,
  gameId: apiSet.game_id,
  number: apiSet.number,
  localTeamSide: apiSet.local_team_side ?? undefined,
  visitorTeamSide: apiSet.visitor_team_side ?? undefined,
  firstServeTeamId: apiSet.first_serve_team_id ?? undefined,
  localTeamScore: apiSet.local_team_score ?? undefined,
  visitorTeamScore: apiSet.visitor_team_score ?? undefined,
  winnerTeamId: apiSet.winner_team_id ?? undefined,
  loserTeamId: apiSet.loser_team_id ?? undefined,
  start: apiSet.start ?? undefined,
  end: apiSet.end ?? undefined,
  comments: apiSet.comments ?? undefined,

  lastPoint: apiSet.last_point
    ? mapApiPointToPoint(apiSet.last_point)
    : undefined,
  lastTwoPoints: apiSet.last_two_points
    ? apiSet.last_two_points.map(mapApiPointToPoint)
    : undefined,
  rotations: apiSet.rotations
    ? apiSet.rotations.map(mapApiRotationToRotation)
    : undefined,
  timeouts: apiSet.timeouts
    ? apiSet.timeouts.map(mapApiTimeoutToTimeout)
    : undefined,
})

export const mapSetStartRequestToApiSetStartRequest = (
  setStartRequest: SetStartRequest,
): ApiSetStartRequest => ({
  local_team_side: setStartRequest.localTeamSide,
  visitor_team_side: setStartRequest.visitorTeamSide,
  first_serve_team_id: setStartRequest.firstServeTeamId,
})
