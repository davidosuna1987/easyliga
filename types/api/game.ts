import { ApiSede } from '@/types/api/sede'
import { ApiLeague } from '@/types/api/league'
import { ApiDivision } from '@/types/api/division'
import { ApiClub } from '@/types/api/club'
import { ApiCourt } from '@/types/api/court'
import { ApiTeam } from '@/types/api/team'
import { ApiPlayer, ApiProfile, ApiUser } from '@/types/api/auth'
import { ApiCall } from '@/types/api/call'
import { ApiSet } from '@/types/api/set'
import { GameStatus } from '@/domain/game'

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
}

export type ApiGame = {
  id: number
  name: string
  league_id: number | null
  division_id: number | null
  club_id: number | null
  sede_id: number | null
  court_id: number | null
  referee_id: number | null
  local_team_id: number | null
  visitor_team_id: number | null
  date: string | null
  start: string | null
  end: string | null
  winner_team_id: number | null
  loser_team_id: number | null
  status: GameStatus
  comments: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiGameRelations

export type ApiGameWithSedes = ApiGame & {
  sedes: ApiSede[]
}

export type ApiGameResponse = {
  success: boolean
  data: {
    game: ApiGame
  }
  errors: null
}

export type ApiGamesResponse = {
  success: boolean
  data: {
    games: ApiGame[]
  }
  errors: null
}

export type ApiGameStoreRequest = {
  league_id: number | null
  court_id: number | null
  referee_id: number | null
  local_team_id: number | null
  visitor_team_id: number | null
}

export type ApiGameInitialDataResponse = {
  success: boolean
  data: {
    game: ApiGame
    calls: ApiCall[]
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
  success: boolean
  data: {
    game: ApiGame
    call: ApiCall
    players: ApiPlayer[]
  }
  errors: null
}
