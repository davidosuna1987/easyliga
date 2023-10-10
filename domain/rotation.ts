import {
  ApiCurrentRotation,
  ApiRotation,
  ApiRotationPlayer,
  ApiRotationUpdateRequest,
  ApiRotationUpdateRequestPlayer,
} from '@/types/api/rotation'
import { Game, mapApiGameToGame } from '@/domain/game'
import { Set, mapApiSetToSet } from '@/domain/set'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { Call, CallPlayerData, mapApiCallToCall } from '@/domain/call'

export const ROTATION_PLAYERS_LENGTH = 6
export const MAX_ROTATION_PLAYER_CHANGES = 6
export const DEFENSE_POSITIONS = [1, 5, 6]
export const ATTACK_POSITIONS = [2, 3, 4]
export const POSITIONS = [1, 2, 3, 4, 5, 6]

export enum ChangeType {
  NONE = 0,
  FIRST = 1,
  SECOND = 2,
}

export type RotationPlayer = {
  profileId: number
  rotationId: number
  replacementProfileId: number | null
  inCourtProfileId: number
  position: number
  currentPosition: number
  libero: boolean
}

export type RotationRelations = {
  players: RotationPlayer[]
  call?: Call
  set?: Set
  game?: Game
  team?: Team
}

export type Rotation = {
  id: number
  callId: number
  setId: number
  number: number
  inCourtCaptainProfileId: number
  playerChangesCount: number
  locked: boolean
} & RotationRelations

export type RotationUpdateRequestPlayer = {
  profileId: number
  replacementProfileId: number
  inCourtProfileId: number
  position: number
  libero: boolean
}

export type RotationUpdateRequest = {
  inCourtCaptainProfileId: number
  players: RotationUpdateRequestPlayer[]
}

export type CurrentRotation = {
  [profileId: number]: number
}

export type RotationPlayerChangeRequest = {
  profileId: number
  replacementProfileId: number
  inCourtProfileId: number
  position: number
  libero: boolean
  comesFromApi: boolean
}

export type RotationPlayerChangeForm = {
  rotation: Rotation
  changes: RotationPlayerChangeRequest[]
}

export type RotationPlayerChange = {
  in: CallPlayerData
  out: CallPlayerData
}

export const mapRotationPlayerToApiRotationPlayer = (
  rotationPlayer: RotationPlayer,
): ApiRotationPlayer => ({
  profile_id: rotationPlayer.profileId,
  rotation_id: rotationPlayer.rotationId,
  replacement_profile_id: rotationPlayer.replacementProfileId,
  in_court_profile_id: rotationPlayer.inCourtProfileId,
  position: rotationPlayer.position,
  current_position: rotationPlayer.currentPosition,
  libero: rotationPlayer.libero,
})

export const mapRotationPlayerChangeRequestToRotationUpdateRequestPlayer = (
  rotationPlayerChangeRequest: RotationPlayerChangeRequest,
): RotationUpdateRequestPlayer => ({
  profileId: rotationPlayerChangeRequest.profileId,
  replacementProfileId: rotationPlayerChangeRequest.replacementProfileId,
  inCourtProfileId: rotationPlayerChangeRequest.inCourtProfileId,
  position: rotationPlayerChangeRequest.position,
  libero: rotationPlayerChangeRequest.libero,
})

export const mapApiRotationPlayerToRotationPlayer = (
  apiRotationPlayer: ApiRotationPlayer,
): RotationPlayer => ({
  profileId: apiRotationPlayer.profile_id,
  rotationId: apiRotationPlayer.rotation_id,
  replacementProfileId: apiRotationPlayer.replacement_profile_id,
  inCourtProfileId: apiRotationPlayer.in_court_profile_id,
  position: apiRotationPlayer.position,
  currentPosition: apiRotationPlayer.current_position,
  libero: apiRotationPlayer.libero,
})

export const mapRotationPlayerToApiRotationPlayerChange = (
  rotationPlayer: RotationPlayer,
): ApiRotationUpdateRequestPlayer => ({
  profile_id: rotationPlayer.profileId,
  replacement_profile_id: rotationPlayer.replacementProfileId,
  in_court_profile_id: rotationPlayer.inCourtProfileId,
  position: rotationPlayer.position,
  libero: rotationPlayer.libero,
})

export const mapRotationUpdateRequestPlayerToApiRotationUpdateRequestPlayer = (
  rotationUpdateRequestPlayer: RotationUpdateRequestPlayer,
): ApiRotationUpdateRequestPlayer => ({
  profile_id: rotationUpdateRequestPlayer.profileId,
  replacement_profile_id: rotationUpdateRequestPlayer.replacementProfileId,
  in_court_profile_id: rotationUpdateRequestPlayer.inCourtProfileId,
  position: rotationUpdateRequestPlayer.position,
  libero: rotationUpdateRequestPlayer.libero,
})

export const mapApiRotationToRotation = (
  apiRotation: ApiRotation,
): Rotation => ({
  id: apiRotation.id,
  callId: apiRotation.call_id,
  setId: apiRotation.set_id,
  inCourtCaptainProfileId: apiRotation.in_court_captain_profile_id,
  playerChangesCount: apiRotation.player_changes_count,
  number: apiRotation.number,
  locked: apiRotation.locked,
  players: apiRotation.players
    ? apiRotation.players.map(mapApiRotationPlayerToRotationPlayer)
    : [],
  call: apiRotation.call ? mapApiCallToCall(apiRotation.call) : undefined,
  set: apiRotation.set ? mapApiSetToSet(apiRotation.set) : undefined,
  game: apiRotation.game ? mapApiGameToGame(apiRotation.game) : undefined,
  team: apiRotation.team ? mapApiTeamToTeam(apiRotation.team) : undefined,
})

export const mapApiCurrentRotationToCurrentRotation = (
  apiCurrentRotation: ApiCurrentRotation,
): CurrentRotation => {
  const currentRotation: CurrentRotation = {}

  Object.keys(apiCurrentRotation).forEach(profileId => {
    const parsedProfileId = Number(profileId)
    currentRotation[parsedProfileId] = apiCurrentRotation[profileId]
  })

  return currentRotation
}

export const mapRotationToApiRotationUpdateRequest = (
  rotation: Rotation,
): ApiRotationUpdateRequest => ({
  in_court_captain_profile_id: rotation.inCourtCaptainProfileId,
  players: rotation.players.map(mapRotationPlayerToApiRotationPlayerChange),
})

export const mapRotationUpdateRequestToApiRotationUpdateRequest = (
  rotationUpdateRequest: RotationUpdateRequest,
): ApiRotationUpdateRequest => ({
  in_court_captain_profile_id: rotationUpdateRequest.inCourtCaptainProfileId,
  players: rotationUpdateRequest.players.map(
    mapRotationUpdateRequestPlayerToApiRotationUpdateRequestPlayer,
  ),
})

export const mapPlayerChangeToChangeType = (
  playerChange?: RotationPlayerChangeRequest,
): ChangeType =>
  playerChange?.replacementProfileId
    ? playerChange.profileId === playerChange.inCourtProfileId
      ? ChangeType.SECOND
      : ChangeType.FIRST
    : ChangeType.NONE

export const mapRotationToRotationPlayerChanges = (
  rotation: Rotation,
  callPlayersData: CallPlayerData[],
): RotationPlayerChange[] => {
  const playerChanges: RotationPlayerChange[] = []

  for (let i in rotation.players) {
    const player = rotation.players[i]

    if (!player.replacementProfileId) continue

    const playerIn = callPlayersData.find(
      callPlayerData =>
        callPlayerData.profileId === player.replacementProfileId,
    )
    const playerOut = callPlayersData.find(
      callPlayerData => callPlayerData.profileId === player.profileId,
    )

    if (!playerIn || !playerOut) continue

    playerChanges.push({
      in: playerIn,
      out: playerOut,
    })

    if (player.inCourtProfileId === player.profileId) {
      const playerIn = callPlayersData.find(
        callPlayerData => callPlayerData.profileId === player.profileId,
      )
      const playerOut = callPlayersData.find(
        callPlayerData =>
          callPlayerData.profileId === player.replacementProfileId,
      )

      if (!playerIn || !playerOut) continue

      playerChanges.push({
        in: playerIn,
        out: playerOut,
      })
    }
  }

  return playerChanges
}
