import { ApiFederation } from '@/types/api/federation'
import { ApiGame } from '@/types/api/game'
import { ApiUser } from '@/types/api/user'
import { ApiTeam } from '@/types/api/team'

export type ApiDivisionRelations = {
  federation?: ApiFederation
  responsible?: ApiUser
  teams?: ApiTeam[]
  games?: ApiGame[]
}

export type ApiDivision = {
  id: number
  federation_id: number | null
  name: string
  slug: string
  priority: number
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiDivisionRelations

export type ApiDivisionResponse = {
  success: true
  data: {
    divisions: ApiDivision[]
  }
  errors: null
}
