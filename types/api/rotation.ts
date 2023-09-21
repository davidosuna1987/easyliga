import { ApiCall } from '@/types/api/call'
import { ApiGame } from '@/types/api/game'
import { ApiSet } from '@/types/api/set'
import { ApiTeam } from '@/types/api/team'

export type ApiRotationPlayer = {
  profile_id: number
  rotation_id: number
  replacement_profile_id: number | null
  in_court_profile_id: number
  position: number
  libero: boolean
}

export type ApiRotationRelations = {
  call?: ApiCall
  set?: ApiSet
  game?: ApiGame
  team?: ApiTeam
  players?: ApiRotationPlayer[]
}

export type ApiRotation = {
  id: number
  call_id: number
  set_id: number
  in_court_captain_profile_id: number
  number: number
  locked: boolean
  players: ApiRotationPlayer[]
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
} & ApiRotationRelations

export type ApiRotationResponse = {
  success: boolean
  data: {
    rotation: ApiRotation
  }
  errors: null
}

export type ApiRotationsResponse = {
  success: boolean
  data: {
    rotations: ApiRotation[]
  }
  errors: null
}

export type ApiRotationPlayerStoreRequest = Omit<
  ApiRotationPlayer,
  'rotation_id'
>

export type ApiRotationStoreRequest = {
  call_id: number
  set_id: number
  number: number | null
  in_court_captain_profile_id: number
  players: ApiRotationPlayerStoreRequest[]
}

export type ApiRotationCreatedEventResponse = {
  rotation: ApiRotation
  call: ApiCall
  team: ApiTeam
}

export type ApiCurrentRotation = {
  [profileId: string]: number
}
