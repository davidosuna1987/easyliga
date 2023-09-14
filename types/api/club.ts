import { ApiSede } from '@/types/api/sede'
import { ApiAddress } from '@/types/api/address'
import { ApiFederation } from '@/types/api/federation'
import { ApiProfile } from '@/types/api/profile'
import { ApiTeam } from '@/types/api/team'
import { ApiGame } from '@/types/api/game'

export type ApiClubRelations = {
  address?: ApiAddress
  sedes?: ApiSede[]
  federation?: ApiFederation
  responsible?: ApiProfile
  teams?: ApiTeam[]
  games?: ApiGame[]
}

export type ApiClub = {
  id: number
  federation_id: number | null
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
} & ApiClubRelations

export type ApiClubResponse = {
  success: boolean
  data: {
    club: ApiClub
  }
  errors: null
}

export type ApiClubsResponse = {
  success: boolean
  data: {
    clubs: ApiClub[]
  }
  errors: null
}
