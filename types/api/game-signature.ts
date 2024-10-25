import { GameSignatureType } from '@/domain/game-signature'
import { ApiUser } from '@/types/api/user'
import { ApiGame } from '@/types/api/game'
import { ApiProfile } from '@/types/api/profile'
import { ApiTeam } from '@/types/api/team'
import { TeamType } from '@/domain/team'

export type ApiGameSignatureRelations = {
  game?: ApiGame
  team?: ApiTeam
  profile?: ApiProfile
  user?: ApiUser
}

export type ApiGameSignature = {
  game_id: number
  team_id: number | null
  profile_id: number
  type: GameSignatureType
  signature: string
} & ApiGameSignatureRelations

export type ApiGameSignatureResponse = {
  success: true
  data: {
    game_signature: ApiGameSignature
  }
  errors: null
}

export type ApiGameSignaturesResponse = {
  success: true
  data: {
    game_signatures: ApiGameSignature[]
  }
  errors: null
}

export type ApiGameSignatureStoreRequest = {
  type: GameSignatureType
  signature: string
  team_type?: TeamType
}

export type ApiGameSignaturesStoreRequest = ApiGameSignatureStoreRequest[]
