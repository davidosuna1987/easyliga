import { ApiLeague } from '@/types/api/league'
import { ApiUser } from '@/types/api/user'
import { ApiDivision } from '@/types/api/division'
import { ApiClub } from '@/types/api/club'
import { ApiSede } from '@/types/api/sede'
import { ApiAddress } from '@/types/api/address'
import { FederationScope } from '@/domain/federation'
import { ApiLicense } from '@/types/api/license'

export type ApiFederationRelations = {
  responsible?: ApiUser
  federation?: ApiFederation
  federations?: ApiFederation[]
  divisions?: ApiDivision[]
  leagues?: ApiLeague[]
  clubs?: ApiClub[]
  sedes?: ApiSede[]
  address?: ApiAddress
  licenses?: ApiLicense[]
  referees?: ApiUser[]
  admin_referees?: ApiUser[]
  regular_referees?: ApiUser[]
}

export type ApiFederationCountRelations = {
  federations_count?: number
  divisions_count?: number
  leagues_count?: number
  clubs_count?: number
  sedes_count?: number
}

export type ApiFederation = {
  id: number
  federation_id: number | null
  responsible_id: number | null
  address_id: number | null
  name: string
  short_name: string | null
  slug: string
  scope: FederationScope | null
  email: string | null
  phone: string | null
  website: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiFederationRelations &
  ApiFederationCountRelations

export type ApiFederationFormRequest = {
  id: number
  federation_id: number | null
  responsible_id: number | null
  address_id: number | null
  name: string
  short_name: string | null
  scope: FederationScope | null
  email: string | null
  phone: string | null
  website: string | null
  address: ApiAddress
}

export type ApiFederationResponse = {
  success: true
  data: {
    federation: ApiFederation
  }
  errors: null
}

export type ApiFederationsResponse = {
  success: true
  data: {
    federations: ApiFederation[]
  }
  errors: null
}
