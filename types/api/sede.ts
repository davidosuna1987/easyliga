import { ApiCourt } from '@/types/api/court'

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
}
export type ApiSedeWithCourts = ApiSede & {
  courts: ApiCourt[]
}

export type ApiSedeResponse = {
  success: boolean
  data: {
    sedes: ApiSede[]
  }
  errors: null
}
