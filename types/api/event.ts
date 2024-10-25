import { GameStatus } from '@/domain/game'
import { ApiRotation, ApiRotationPlayer } from '@/types/api/rotation'
import { ApiCall } from '@/types/api/call'
import { ApiTeam } from '@/types/api/team'
import { ApiTimeout } from '@/types/api/timeout'
import { ApiSanction } from '@/types/api/sanction'
import { ApiProfile } from '@/types/api/profile'
import { ApiGameSignature } from '@/types/api/game-signature'
import { ApiGame } from '@/types/api/game'
import { ApiUser } from '@/types/api/user'
import { ApiInjury } from '@/types/api/injury'
import { RotationPlayerStatus } from '@/domain/rotation'

export enum ApiEvents {
  CALL_UPDATED = 'CallUpdatedEvent',
  CALL_UNLOCKED = 'CallUnlockedEvent',
  ROTATION_CREATED = 'RotationCreatedEvent',
  ROTATION_UPDATED = 'RotationUpdatedEvent',
  ROTATION_LOCK_TOGGLED = 'RotationLockToggledEvent',
  GAME_STATUS_UPDATED = 'GameStatusUpdatedEvent',
  TIMEOUT_STATUS_UPDATED = 'TimeoutStatusUpdatedEvent',
  SANCTION_STORED = 'SanctionStoredEvent',
  GAME_SIGNATURE_CREATED = 'GameSignatureCreatedEvent',
  REQUEST_CHANGE_DATE = 'RequestChangeDateEvent',
  PLAYER_ROTATON_STATUS_UPDATED = 'PlayerRotationStatusUpdatedEvent',
  INJURY_STORED = 'InjuryStoredEvent',
}

export type ApiCallUpdatedEventResponse = {
  call: ApiCall
  team: ApiTeam
}

export type ApiCallUnlockedEventResponse = {
  call: ApiCall
}

export type ApiRotationCreatedEventResponse = {
  rotation: ApiRotation
  call: ApiCall
  team: ApiTeam
}

export type ApiRotationUpdatedEventResponse = {
  rotation: ApiRotation
  team: ApiTeam
  changes_count: number
}

export type ApiRotationLockToggledEventResponse = {
  rotation: ApiRotation
}

export type ApiGameStatusUpdatedEventResponse = {
  status: GameStatus
}

export type ApiTimeoutStatusUpdatedEventResponse = {
  timeout: ApiTimeout
  team: ApiTeam
}

export type ApiSanctionStoredEventResponse = {
  sanction: ApiSanction
  team: ApiTeam
  profile: ApiProfile | null
}

export type ApiGameSignatureCreatedEventResponse = {
  team: ApiTeam
  game_signature: ApiGameSignature
}

export type ApiRequestChangeDateEventResponse = {
  game: ApiGame
  emitter: ApiUser
  action: string
}

export type ApiGamePlayerRotationStatusUpdatedEventResponse = {
  game_id: number
  set_id: number
  team_id: number
  rotation: ApiRotation
  player_rotation: ApiRotationPlayer
  player_in_profile_id: number
  player_out_profile_id: number
  status: RotationPlayerStatus
}

export type ApiGameInjuryStoredEvent = {
  injury: ApiInjury
  team_name: string
}
