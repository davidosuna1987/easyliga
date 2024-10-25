import { GenderType } from '@/domain/game'

export type ApiGender = {
  id: number
  name: GenderType
  slug: string
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export type ApiGenderResponse = {
  success: true
  data: {
    genders: ApiGender[]
  }
  errors: null
}
