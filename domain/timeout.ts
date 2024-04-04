import { Set, mapApiSetToSet } from '@/domain/set'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { Game, mapApiGameToGame } from '@/domain/game'
import {
  ApiTimeout,
  ApiTimeoutStoreRequest,
  ApiTimeoutUpdateRequest,
} from '@/types/api/timeout'

export const MAX_TIMEOUTS_PER_SET = 2

export enum TimeoutStatusEnum {
  requested = 'requested',
  running = 'running',
  finished = 'finished',
}

export type TimeoutStatus = keyof typeof TimeoutStatusEnum

export type TimeoutRelations = {
  set?: Set
  team?: Team
  game?: Game
}

export type Timeout = {
  id: number
  setId: number
  teamId: number
  status: TimeoutStatus
} & TimeoutRelations

export type TimeoutStoreRequest = {
  setId: number
  teamId: number
  status: TimeoutStatus
}

export type TimeoutUpdateRequest = {
  status: TimeoutStatus
}

export const mapApiTimeoutToTimeout = (apiTimeout: ApiTimeout): Timeout => ({
  id: apiTimeout.id,
  setId: apiTimeout.set_id,
  teamId: apiTimeout.team_id,
  status: apiTimeout.status,
  set: apiTimeout.set ? mapApiSetToSet(apiTimeout.set) : undefined,
  team: apiTimeout.team ? mapApiTeamToTeam(apiTimeout.team) : undefined,
  game: apiTimeout.game ? mapApiGameToGame(apiTimeout.game) : undefined,
})

export const mapTimeoutStoreRequestToApiTimeoutStoreRequest = (
  timeout: TimeoutStoreRequest,
): ApiTimeoutStoreRequest => ({
  set_id: timeout.setId,
  team_id: timeout.teamId,
  status: timeout.status,
})

export const mapTimeoutUpdateRequestToApiTimeoutUpdateRequest = (
  timeout: TimeoutUpdateRequest,
): ApiTimeoutUpdateRequest => ({
  status: timeout.status,
})

export const getTimeoutsByTeamId = (
  timeouts: Timeout[],
  teamId: number,
): Timeout[] => timeouts.filter(timeout => timeout.teamId === teamId)
