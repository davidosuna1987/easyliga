import { ApiLeague } from '@/types/api/league'

export type ApiFederation = {
  id: number
  federation_id: number | null
  resposnsible_id: number | null
  address_id: number | null
  name: string
  short_name: string | null
  slug: string
  scope: string | null
  email: string | null
  phone: string | null
  website: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export type ApiFederationWithFederations = ApiFederation & {
  federations: ApiFederation[]
}

export type ApiFederationWithLeagues = ApiFederation & {
  leagues: ApiLeague[]
}

export type ApiFederationResponse = {
  success: boolean
  data: {
    federations: ApiFederation[]
  }
  errors: null
}

export type FederationScope =
  | 'national'
  | 'regional'
  | 'provincial'
  | 'district'
  | 'local'
