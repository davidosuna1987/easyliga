export type ApiDivision = {
  id: number
  federation_id: number | null
  name: string
  slug: string
  priority: number
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export type ApiDivisionResponse = {
  success: boolean
  data: {
    divisions: ApiDivision[]
  }
  errors: null
}
