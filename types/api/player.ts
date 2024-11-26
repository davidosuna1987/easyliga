import { ApiTeam } from '@/types/api/team'
import { ApiProfile } from '@/types/api/profile'
import { ProfileGender } from '@/domain/profile'
import { ApiUserStoreRequest } from './user'

export type ApiPlayerTeamPivot = {
  type: 'API_PLAYER_TEAM_PIVOT'
  team_id: number
  profile_id: number
  shirt_number: number
  captain: boolean
  libero: boolean
}

export type ApiPlayer = ApiProfile & {
  pivot: ApiPlayerTeamPivot
}

export type ApiPlayerRequest = {
  profile_id: number
  shirt_number: number
  captain: boolean
  libero: boolean
}

export type ApiPlayerStoreRequest = ApiUserStoreRequest & {
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
