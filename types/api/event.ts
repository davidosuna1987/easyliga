import { GameStatus } from '@/domain/game'
import { ApiRotation } from '@/types/api/rotation'
import { ApiCall } from '@/types/api/call'
import { ApiTeam } from '@/types/api/team'
import { ApiTimeout } from '@/types/api/timeout'

export enum ApiEvents {
  CALL_UPDATED = 'CallUpdatedEvent',
  CALL_UNLOCKED = 'CallUnlockedEvent',
  ROTATION_CREATED = 'RotationCreatedEvent',
  ROTATION_UPDATED = 'RotationUpdatedEvent',
  ROTATION_LOCK_TOGGLED = 'RotationLockToggledEvent',
  GAME_STATUS_UPDATED = 'GameStatusUpdatedEvent',
  TIMEOUT_STATUS_UPDATED = 'TimeoutStatusUpdatedEvent',
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
