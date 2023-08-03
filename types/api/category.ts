export type ApiCategory = {
  id: number
  name: string
  slug: string
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export type ApiCategoryResponse = {
  success: boolean
  data: {
    categories: ApiCategory[]
  }
  errors: null
}
