import { ApiCategory } from '@/types/api/category'
import { ApiDivision } from '@/types/api/division'
import { ApiTeam } from '@/types/api/team'

export type ApiLeagueRelatioins = {
  division?: ApiDivision
  category?: ApiCategory
  gender?: {
    id: number
    name: 'masculine' | 'femenine' | 'mixed'
  }
  teams?: ApiTeam[]
}

export type ApiLeagueCountRelations = {
  teams_count?: number
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
