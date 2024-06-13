import { ApiUser } from '@/types/api/user'
import { ApiClub } from '@/types/api/club'
import { ApiSede } from '@/types/api/sede'
import { ApiPlayer } from '@/types/api/auth'
import { ApiCategory } from '@/types/api/category'
import { ApiDivision } from '@/types/api/division'
import { ApiGender } from '@/types/api/gender'
import { ApiPlayerRequest } from '@/types/api/player'
import { ShirtColor } from '@/domain/team'
import { ApiLicense } from '@/types/api/license'

export type ApiTeamRelations = {
  club?: ApiClub
  sede?: ApiSede
  sedes?: ApiSede[]
  division?: ApiDivision
  category?: ApiCategory
  gender?: ApiGender
  coach?: ApiUser
  players?: ApiPlayer[]
  licenses?: ApiLicense[]
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
  shirt_color: ShirtColor | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiTeamRelations

export type ApiTeamResponse = {
  success: boolean
  data: {
    team: ApiTeam
  }
  errors: null
}

export type ApiTeamsResponse = {
  success: boolean
  data: {
    teams: ApiTeam[]
  }
  errors: null
}

export type ApiTeamRequest = {
  name: string
  club_id: number | null
  sede_id: number | null
  division_id: number | null
  category_id: number | null
  gender_id: number | null
  coach_id: number | null
  players: ApiPlayerRequest[] | null
  shirt_color: ShirtColor | null
}
