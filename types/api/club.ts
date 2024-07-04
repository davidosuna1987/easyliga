import { ApiSede } from '@/types/api/sede'
import { ApiAddress } from '@/types/api/address'
import { ApiFederation } from '@/types/api/federation'
import { ApiTeam } from '@/types/api/team'
import { ApiGame } from '@/types/api/game'
import { ApiLicense } from '@/types/api/license'
import { ApiUser } from '@/types/api/user'

export type ApiClubRelations = {
  address?: ApiAddress
  sedes?: ApiSede[]
  federation?: ApiFederation
  responsible?: ApiUser
  teams?: ApiTeam[]
  games?: ApiGame[]
  licenses?: ApiLicense[]
}

export type ApiClubCountRelations = {
  sedes_count: number | null
  teams_count: number | null
  games_count: number | null
  licenses_count: number | null
}

export type ApiClub = {
  id: number
  federation_id: number | null
  responsible_id: number | null
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
} & ApiClubRelations &
  ApiClubCountRelations

export type ApiClubFormRequest = {
  id: number
  federation_id: number | null
  responsible_id: number | null
  address_id: number | null
  name: string
  short_name: string | null
  email: string | null
  phone: string | null
  website: string | null
  address: ApiAddress
}

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
