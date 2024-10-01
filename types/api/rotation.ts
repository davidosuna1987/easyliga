import { ApiCall } from '@/types/api/call'
import { ApiGame } from '@/types/api/game'
import { ApiSet } from '@/types/api/set'
import { ApiTeam } from '@/types/api/team'
import { ApiSanction } from '@/types/api/sanction'
import { RotationPlayerStatus } from '@/domain/rotation'

export type ApiRotationPlayerDeniedChangePlayerChange = {
  id: number
  profile_id: number
  replacement_profile_id: number
  in_court_profile_id: number
  position: number
  status: 'denied'
  libero: boolean
  change_windows: number[]
  comes_from_api: boolean
}

export type ApiRotationPlayerDeniedChange = {
  denied_at: string
  denied_by: number
  deny_reason: string | null
  change_window: number
  player_change: ApiRotationPlayerDeniedChangePlayerChange
}

export type ApiRotationPlayer = {
  id: number
  profile_id: number
  rotation_id: number
  replacement_profile_id: number | null
  in_court_profile_id: number
  position: number
  status: RotationPlayerStatus
  current_position: number
  libero: boolean
  change_windows: number[] | null
  denied_changes: ApiRotationPlayerDeniedChange[] | null
}

export type ApiRotationUpdateRequestPlayer = Pick<
  ApiRotationPlayer,
  | 'id'
  | 'profile_id'
  | 'replacement_profile_id'
  | 'in_court_profile_id'
  | 'position'
  | 'libero'
  | 'change_windows'
>

export type ApiRotationRelations = {
  players: ApiRotationPlayer[]
  call?: ApiCall
  set?: ApiSet
  game?: ApiGame
  team?: ApiTeam
  set_sanctions?: ApiSanction[]
}

export type ApiRotation = {
  id: number
  call_id: number
  set_id: number
  in_court_captain_profile_id: number
  requested_in_court_captain_profile_id: number | null
  player_changes_count: number
  number: number
  locked: boolean
  current_change_window: number
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
  change_window: number
  in_court_captain_profile_id: number
  players: ApiRotationUpdateRequestPlayer[]
}
