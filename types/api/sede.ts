import { ApiCourt } from '@/types/api/court'
import { ApiAddress } from '@/types/api/address'
import { ApiClub } from '@/types/api/club'
import { ApiProfile } from '@/types/api/profile'
import { ApiTeam } from '@/types/api/team'
import { ApiGame } from '@/types/api/game'

export type ApiSedeRelations = {
  address?: ApiAddress
  club?: ApiClub
  responsible?: ApiProfile
  courts?: ApiCourt[]
  teams?: ApiTeam[]
  games?: ApiGame[]
}

export type ApiSede = {
  id: number
  club_id: number | null
  resposnsible_id: number | null
  address_id: number | null
  name: string
  short_name: string | null
  slug: string
  email: string | null
  phone: string | null
  website: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiSedeRelations

export type ApiSedeResponse = {
  success: boolean
  data: {
    sedes: ApiSede[]
  }
  errors: null
}
