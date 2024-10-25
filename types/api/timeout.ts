import { ApiSet } from '@/types/api/set'
import { ApiTeam } from '@/types/api/team'
import { ApiGame } from '@/types/api/game'
import { TimeoutStatus } from '@/domain/timeout'

export type ApiTimeoutRelations = {
  set?: ApiSet
  team?: ApiTeam
  game?: ApiGame
}

export type ApiTimeout = {
  id: number
  set_id: number
  team_id: number
  status: TimeoutStatus
} & ApiTimeoutRelations

export type ApiTimeoutStoreRequest = {
  set_id: number
  team_id: number
  status: TimeoutStatus
}

export type ApiTimeoutUpdateRequest = {
  status: TimeoutStatus
}

export type ApiTimeoutResponse = {
  success: true
  data: {
    timeout: ApiTimeout
  }
  errors: null
}
