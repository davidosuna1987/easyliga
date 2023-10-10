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
  current_position: number
  libero: boolean
}

export type ApiRotationUpdateRequestPlayer = Pick<
  ApiRotationPlayer,
  | 'profile_id'
  | 'replacement_profile_id'
  | 'in_court_profile_id'
  | 'position'
  | 'libero'
>

export type ApiRotationRelations = {
  players: ApiRotationPlayer[]
  call?: ApiCall
  set?: ApiSet
  game?: ApiGame
  team?: ApiTeam
}

export type ApiRotation = {
  id: number
  call_id: number
  set_id: number
  in_court_captain_profile_id: number
  player_changes_count: number
  number: number
  locked: boolean
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

export type ApiCurrentRotation = {
  [profileId: string]: number
}

export type ApiRotationUpdateRequest = {
  in_court_captain_profile_id: number
  players: ApiRotationUpdateRequestPlayer[]
}
