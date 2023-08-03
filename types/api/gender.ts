export type ApiGender = {
  id: number
  name: string
  slug: string
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export type ApiGenderResponse = {
  success: boolean
  data: {
    genders: ApiGender[]
  }
  errors: null
}
