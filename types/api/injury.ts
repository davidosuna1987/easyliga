import { ApiGame } from '@/types/api/game'
import { ApiSet } from '@/types/api/set'
import { ApiRotation } from '@/types/api/rotation'
import { ApiTeam } from '@/types/api/team'
import { ApiProfile } from '@/types/api/profile'

export type ApiInjuryRelations = {
  game?: ApiGame
  set?: ApiSet
  rotation?: ApiRotation
  team?: ApiTeam
  profile?: ApiProfile
  replacement_profile?: ApiProfile
  playerIn?: ApiProfile
  playerOut?: ApiProfile
}

export type ApiInjury = {
  id: number
  game_id: number
  set_id: number
  rotation_id: number
  team_id: number
  player_rotation_id: number
  profile_id: number
  replacement_profile_id: number
  libero: boolean
  description: string
} & ApiInjuryRelations

export type ApiInjuryFormRequest = {
  game_id: number
  set_id: number
  rotation_id: number
  team_id: number
  injuries: {
    player_rotation_id: number
    profile_id: number
    replacement_profile_id: number
    libero: boolean
    description: string
    player_in_shirt_number?: number
    player_out_shirt_number?: number
  }[]
}

export type ApiInjuryResponse = {
  success: true
  data: {
    injury: ApiInjury
  }
  errors: null
}

export type ApiInjuriesResponse = {
  success: true
  data: {
    injuries: ApiInjury[]
  }
  errors: null
}
