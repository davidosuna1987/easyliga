import { ApiSet, ApiSetStartRequest } from '@/types/api/set'
import { Point, mapApiPointToPoint } from '@/domain/point'
import { Rotation, mapApiRotationToRotation } from '@/domain/rotation'
import { Timeout, mapApiTimeoutToTimeout } from '@/domain/timeout'
import { Sanction, mapApiSanctionToSanction } from '@/domain/sanction'
import { Duration, mapApiDurationToDuration } from '@/domain/utils'

export const POINT_DIFFERENCE_TO_WIN = 2
export const SET_POINTS_TO_WIN = 5
export const LAST_SET_POINTS_TO_WIN = 3
export const MAX_SETS_PER_MATCH = 3

export enum SetSide {
  LEFT = 'left',
  RIGHT = 'right',
}

export type SetRelations = {
  lastPoint?: Point
  lastTwoPoints?: Point[]
  rotations?: Rotation[]
  timeouts?: Timeout[]
  sanctions?: Sanction[]
  gameSanctions?: Sanction[]
}

export type SetRelationsCount = {
  rotationsCount?: number
  timeoutsCount?: number
  sanctionsCount?: number
  gameSanctionsCount?: number
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
  duration?: Duration
  observations?: string
} & SetRelations &
  SetRelationsCount

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
  duration: mapApiDurationToDuration(apiSet.duration),
  observations: apiSet.observations ?? undefined,

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
  sanctions: apiSet.sanctions
    ? apiSet.sanctions.map(mapApiSanctionToSanction)
    : undefined,
  gameSanctions: apiSet.game_sanctions
    ? apiSet.game_sanctions.map(mapApiSanctionToSanction)
    : undefined,

  rotationsCount: apiSet.rotations_count ?? undefined,
  timeoutsCount: apiSet.timeouts_count ?? undefined,
  sanctionsCount: apiSet.sanctions_count ?? undefined,
  gameSanctionsCount: apiSet.game_sanctions_count ?? undefined,
})

export const mapSetStartRequestToApiSetStartRequest = (
  setStartRequest: SetStartRequest,
): ApiSetStartRequest => ({
  local_team_side: setStartRequest.localTeamSide,
  visitor_team_side: setStartRequest.visitorTeamSide,
  first_serve_team_id: setStartRequest.firstServeTeamId,
})
