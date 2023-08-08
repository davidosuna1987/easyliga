import { ApiClub } from '@/types/api/club'
import { ApiSede } from '@/types/api/sede'
import { ApiProfile } from '@/types/api/auth'
import { ApiCategory } from '@/types/api/category'
import { ApiDivision } from '@/types/api/division'
import { ApiGender } from '@/types/api/gender'

export type ApiTeamRelations = {
  club?: ApiClub
  sede?: ApiSede
  division?: ApiDivision
  category?: ApiCategory
  gender?: ApiGender
  coach?: ApiProfile
  players?: ApiProfile[]
}

export type ApiTeam = {
  id: number
  club_id: number | null
  sede_id: number | null
  division_id: number | null
  category_id: number | null
  gender_id: number | null
  coach_id: number | null
  name: string
  slug: string
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiTeamRelations

export type ApiTeamResponse = {
  success: boolean
  data: {
    teams: ApiTeam[]
  }
  errors: null
}
