export type ApiLeague = {
  id: number
  division_id: number | null
  category_id: number | null
  gender_id: number | null
  season: number
  start: string | null
  end: string | null
  name: string
  slug: string
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}
