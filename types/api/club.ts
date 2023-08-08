import { ApiSede } from '@/types/api/sede'

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
}
export type ApiClubWithSedes = ApiClub & {
  sedes: ApiSede[]
}

export type ApiClubResponse = {
  success: boolean
  data: {
    clubs: ApiClub[]
  }
  errors: null
}
