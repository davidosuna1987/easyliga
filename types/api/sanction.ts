import { ApiSet } from '@/types/api/set'
import { ApiTeam } from '@/types/api/team'
import { ApiGame } from '@/types/api/game'
import { ApiPoint } from '@/types/api/point'
import { ApiUser } from '@/types/api/user'
import { ApiProfile } from '@/types/api/profile'
import { SanctionSeverityKey, SanctionTypeKey } from '@/domain/sanction'

export type ApiSanctionRelations = {
  game?: ApiGame
  set?: ApiSet
  team?: ApiTeam
  point?: ApiPoint
  coach?: ApiUser
  player?: ApiUser
  coach_profile?: ApiProfile
  player_profile?: ApiProfile
}

export type ApiSanction = {
  id: number
  type: SanctionTypeKey
  severity: SanctionSeverityKey
  player_replaced_at: string | null
  set_id: number
  team_id: number
  player_profile_id?: number
  coach_profile_id?: number
  local_team_score: number
  visitor_team_score: number
  observations?: string
} & ApiSanctionRelations

export type ApiSanctionStoreRequest = {
  type: SanctionTypeKey
  severity: SanctionSeverityKey
  set_id: number
  team_id: number
  player_profile_id?: number
  coach_profile_id?: number
  observations?: string
}

export type ApiSanctionResponse = {
  success: true
  data: {
    sanction: ApiSanction
  }
  errors: null
}
