import { ApiTeam } from '@/types/api/team'
import { ApiProfile } from '@/types/api/profile'
import { ProfileGender } from '@/domain/profile'

export type ApiPlayer = ApiProfile & {
  pivot: {
    team_id: number
    profile_id: number
    shirt_number: number
    captain: boolean
    libero: boolean
  }
}

export type ApiPlayerRequest = {
  profile_id: number
  shirt_number: number
  captain: boolean
  libero: boolean
}

export type ApiPlayerStoreRequestEmailRequired = {
  email: string
  allowEmptyEmail: false
}

export type ApiPlayerStoreRequestEmailOptional = {
  email: null
  allowEmptyEmail: true
}

export type ApiPlayerStoreRequestEmail =
  | ApiPlayerStoreRequestEmailRequired
  | ApiPlayerStoreRequestEmailOptional

export type ApiPlayerStoreRequest = {
  allow_empty_email: boolean
  email?: string
  first_name: string
  last_name: string
  birth_date?: string
  gender?: ProfileGender
  shirt_number: number
  captain: boolean
  libero: boolean
}

export type ApiPlayerStoreResponse = {
  success: true
  data: {
    team: ApiTeam
    player: ApiPlayer
  }
  errors: null
}
