import { ApiCategory } from '@/types/api/category'
import { ApiDivision } from '@/types/api/division'
import { ApiTeam } from '@/types/api/team'
import { ApiGame } from '@/types/api/game'

export type ApiLeagueRelatioins = {
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
  ApiLeagueCountRelations

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
