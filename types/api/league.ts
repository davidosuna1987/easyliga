import { ApiCategory } from '@/types/api/category'
import { ApiDivision } from '@/types/api/division'
import { ApiTeam } from '@/types/api/team'
import { ApiGame } from '@/types/api/game'
import { ApiFederation } from '@/types/api/federation'

export type ApiLeagueRelatioins = {
  federation?: ApiFederation
  division?: ApiDivision
  category?: ApiCategory
  gender?: {
    id: number
    name: 'masculine' | 'femenine' | 'mixed'
  }
  teams?: ApiTeam[]
  games?: ApiGame[]
}

export type ApiLeagueCountRelations = {
  teams_count?: number
  games_count?: number
}

export type ApiLeagueCustomAppends = {
  full_name?: string
  name_long: string
}

export type ApiLeague = {
  id: number
  division_id: number | null
  category_id: number | null
  gender_id: number | null
  season: number
  start: string | null
  end: string | null
  name: string
  slug: string
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiLeagueRelatioins &
  ApiLeagueCountRelations &
  ApiLeagueCustomAppends

export type ApiCreateMatchdaysGamesRequest = {
  start: Date | null
}

export type ApiLeagueResponse = {
  success: boolean
  data: {
    league: ApiLeague
  }
  errors: null
}

export type ApiLeaguesResponse = {
  success: boolean
  data: {
    leagues: ApiLeague[]
  }
  errors: null
}

export type ApiCreateMatchdaysGamesResponse = {
  success: boolean
  data: {
    league: ApiLeague
    games: ApiGame[]
  }
  errors: null
}
