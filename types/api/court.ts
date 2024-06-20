import { ApiGame } from '@/types/api/game'
import { ApiUser } from '@/types/api/user'
import { ApiSede } from '@/types/api/sede'

export type ApiCourtRelations = {
  sede?: ApiSede
  responsible?: ApiUser
  games?: ApiGame[]
}

export type ApiCourt = {
  id: number
  sede_id: number
  name: string
  number: number
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiCourtRelations

export type ApiCourtResponse = {
  success: boolean
  data: {
    courts: ApiCourt[]
  }
  errors: null
}
