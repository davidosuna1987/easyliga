import { ApiSede } from '@/types/api/sede'
import { ApiLeague } from '@/types/api/league'
import { ApiDivision } from '@/types/api/division'
import { ApiClub } from '@/types/api/club'
import { ApiCourt } from '@/types/api/court'
import { ApiTeam } from '@/types/api/team'
import { ApiPlayer } from '@/types/api/auth'
import { ApiUser } from '@/types/api/user'
import { ApiCall } from '@/types/api/call'
import { ApiSet } from '@/types/api/set'
import { GameStatus } from '@/domain/game'
import { ApiCurrentRotation } from '@/types/api/rotation'
import { ApiProfile } from '@/types/api/profile'
import { ApiSanction } from '@/types/api/sanction'
import { ApiGameSignature } from '@/types/api/game-signature'
import { ApiCategory } from '@/types/api/category'
import { ApiGender } from '@/types/api/gender'
import { ApiDuration } from '@/types/api/utils'
import { TeamType } from '@/domain/team'
import { ApiInjury } from '@/types/api/injury'
import { SanctionSeverityKey } from '@/domain/sanction'

export type ApiGameRelations = {
  league?: ApiLeague
  division?: ApiDivision
  club?: ApiClub
  sede?: ApiSede
  court?: ApiCourt
  referee?: ApiUser
  local_team?: ApiTeam
  visitor_team?: ApiTeam
  winner_team?: ApiTeam
  loser_team?: ApiTeam
  teams?: ApiTeam[]
  sets?: ApiSet[]
  current_set?: ApiSet
  calls?: ApiCall[]
  sanctions?: ApiSanction[]
  injuries?: ApiInjury[]
  signatures?: ApiGameSignature[]
}

export type ApiGameRelationsCount = {
  local_team_sets_won_count?: number
  visitor_team_sets_won_count?: number
}

export type ApiGameCustomAppends = {
  name: string
  duration: ApiDuration | null
  confirmed: boolean
}

export type ApiGame = {
  id: number
  league_id: number | null
  division_id: number | null
  club_id: number | null
  sede_id: number | null
  court_id: number | null
  referee_id: number | null
  local_team_id: number | null
  visitor_team_id: number | null
  date: string | null
  date_confirmed_by: number[]
  requested_date: string | null
  date_requested_by: number | null
  matchday: number | null
  start: string | null
  end: string | null
  winner_team_id: number | null
  loser_team_id: number | null
  status: GameStatus | null
  observations: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiGameRelations &
  ApiGameRelationsCount &
  ApiGameCustomAppends

export type ApiGameReportSimple = {
  game: ApiGame
  division: ApiDivision
  category: ApiCategory
  gender: ApiGender
  local_team: ApiTeam
  visitor_team: ApiTeam
  referee: ApiProfile
  sede: ApiSede
  court: ApiCourt
  sets: ApiSet[]
  calls: ApiCall[]
}

export type ApiGameResponse = {
  success: true
  data: {
    game: ApiGame
  }
  errors: null
}

export type ApiGamesResponse = {
  success: true
  data: {
    games: ApiGame[]
  }
  errors: null
}

export type ApiGameStoreRequest = {
  league_id: number
  court_id: number
  referee_id: number
  local_team_id: number
  visitor_team_id: number
  start: Date | null
  status: GameStatus | null
}

export type ApiGameObservationsRequest = {
  observations: string | null
}

export type ApiGameRequestChangeDateRequest = {
  requested_date: string
}

export type ApiGameInitialDataResponse = {
  success: true
  data: {
    game: ApiGame
    calls: ApiCall[]
    local_team_rotation: ApiCurrentRotation
    visitor_team_rotation: ApiCurrentRotation
    local_team_sets_won_count: number
    visitor_team_sets_won_count: number
    league: ApiLeague
    referee: ApiProfile
    local_team: ApiTeam
    visitor_team: ApiTeam
    sede: ApiSede
    court: ApiCourt
  }
  errors: null
}

export type ApiGameTeamPlayersResponse = {
  success: true
  data: {
    team: ApiTeam
    game: ApiGame
    call: ApiCall
    players: ApiPlayer[]
    team_type: TeamType
  }
  errors: null
}

export type ApiGameTeamIncompleteResponse = {
  success: true
  data: {
    incomplete: {
      game: boolean
      current_set: boolean
      sanctioned_player_rotation: number
      sanctioned_profile_id: number
      sanctioned_severity: SanctionSeverityKey
    }
  }
  errors: null
}

export type ApiGameReportSimpleResponse = {
  success: boolean
  data: ApiGameReportSimple
  errors: null
}
