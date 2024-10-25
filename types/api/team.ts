import { ApiUser } from '@/types/api/user'
import { ApiClub } from '@/types/api/club'
import { ApiSede } from '@/types/api/sede'
import { ApiPlayer } from '@/types/api/auth'
import { ApiCategory } from '@/types/api/category'
import { ApiDivision } from '@/types/api/division'
import { ApiPlayerRequest } from '@/types/api/player'
import { ShirtColor } from '@/domain/team'
import { ApiLicense } from '@/types/api/license'
import { ApiFederation } from '@/types/api/federation'
import { Gender } from '@/domain/game'
import { ApiGender } from './gender'

export type ApiTeamRelations = {
  club?: ApiClub
  sede?: ApiSede
  sedes?: ApiSede[]
  division?: ApiDivision
  federation?: ApiFederation
  category?: ApiCategory
  gender?: ApiGender
  coach?: ApiUser
  substitute_coaches?: ApiUser[]
  players?: ApiPlayer[]
  licenses?: ApiLicense[]
}

export type ApiTeamAppends = {
  responsibles?: ApiUser[]
  responsible_ids?: number[]
  editors?: ApiUser[]
  editor_ids?: number[]
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
} & ApiTeamRelations &
  ApiTeamAppends

export type ApiTeamResponse = {
  success: true
  data: {
    team: ApiTeam
  }
  errors: null
}

export type ApiTeamsResponse = {
  success: true
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
  substitute_coaches_ids: number[] | null
  players: ApiPlayerRequest[] | null
  shirt_color: ShirtColor | null
}

export type ApiTeamPlayersRequest = {
  players: ApiPlayerRequest[] | null
}
