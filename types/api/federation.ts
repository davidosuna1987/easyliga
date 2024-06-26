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
}

export type ApiFederation = {
  id: number
  federation_id: number | null
  resposnsible_id: number | null
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
} & ApiFederationRelations

export type ApiFederationResponse = {
  success: boolean
  data: {
    federations: ApiFederation[]
  }
  errors: null
}
