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
import { Sanction, mapApiSanctionToSanction } from '@/domain/sanction'

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

export enum ChangeActionIcon {
  remove = 'ic:baseline-delete',
  done = 'ic:baseline-check-circle',
  undo = 'ic:baseline-replay-circle-filled',
  help = 'ic:baseline-help',
}

export type ChangeAction = keyof typeof ChangeActionIcon

export type RotationPlayer = {
  profileId: number
  rotationId: number
  replacementProfileId?: number
  inCourtProfileId: number
  position: number
  currentPosition: number
  libero: boolean
  changeWindows: number[]
}

export type RotationRelations = {
  players: RotationPlayer[]
  call?: Call
  set?: Set
  game?: Game
  team?: Team
  setSanctions?: Sanction[]
}

export type Rotation = {
  id: number
  callId: number
  setId: number
  number: number
  inCourtCaptainProfileId: number
  playerChangesCount: number
  locked: boolean
  currentChangeWindow: number
} & RotationRelations

export type RotationUpdateRequestPlayer = {
  profileId: number
  replacementProfileId: number
  inCourtProfileId: number
  position: number
  libero: boolean
  changeWindows: number[]
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
  changeWindows: number[]
  comesFromApi: boolean
}

export type RotationPlayerChangeForm = {
  rotation: Rotation
  changes: RotationPlayerChangeRequest[]
}

export type RotationPlayerChange = {
  in: CallPlayerData
  out: CallPlayerData
  changeWindow: number
}

export type RotationWindowPlayerChange = {
  [changeWindow: number]: RotationPlayerChange[]
}

export const mapRotationPlayerToApiRotationPlayer = (
  rotationPlayer: RotationPlayer,
): ApiRotationPlayer => ({
  profile_id: rotationPlayer.profileId,
  rotation_id: rotationPlayer.rotationId,
  replacement_profile_id: rotationPlayer.replacementProfileId ?? null,
  in_court_profile_id: rotationPlayer.inCourtProfileId,
  position: rotationPlayer.position,
  current_position: rotationPlayer.currentPosition,
  libero: rotationPlayer.libero,
  change_windows: rotationPlayer.changeWindows.length
    ? rotationPlayer.changeWindows
    : null,
})

export const mapRotationPlayerChangeRequestToRotationUpdateRequestPlayer = (
  rotationPlayerChangeRequest: RotationPlayerChangeRequest,
): RotationUpdateRequestPlayer => ({
  profileId: rotationPlayerChangeRequest.profileId,
  replacementProfileId: rotationPlayerChangeRequest.replacementProfileId,
  inCourtProfileId: rotationPlayerChangeRequest.inCourtProfileId,
  position: rotationPlayerChangeRequest.position,
  libero: rotationPlayerChangeRequest.libero,
  changeWindows: rotationPlayerChangeRequest.changeWindows,
})

export const mapApiRotationPlayerToRotationPlayer = (
  apiRotationPlayer: ApiRotationPlayer,
): RotationPlayer => ({
  profileId: apiRotationPlayer.profile_id,
  rotationId: apiRotationPlayer.rotation_id,
  replacementProfileId: apiRotationPlayer.replacement_profile_id ?? undefined,
  inCourtProfileId: apiRotationPlayer.in_court_profile_id,
  position: apiRotationPlayer.position,
  currentPosition: apiRotationPlayer.current_position,
  libero: apiRotationPlayer.libero,
  changeWindows: apiRotationPlayer.change_windows ?? [],
})

export const mapRotationPlayerToApiRotationPlayerChange = (
  rotationPlayer: RotationPlayer,
): ApiRotationUpdateRequestPlayer => ({
  profile_id: rotationPlayer.profileId,
  replacement_profile_id: rotationPlayer.replacementProfileId ?? null,
  in_court_profile_id: rotationPlayer.inCourtProfileId,
  position: rotationPlayer.position,
  libero: rotationPlayer.libero,
  change_windows: rotationPlayer.changeWindows.length
    ? rotationPlayer.changeWindows
    : null,
})

export const mapRotationUpdateRequestPlayerToApiRotationUpdateRequestPlayer = (
  rotationUpdateRequestPlayer: RotationUpdateRequestPlayer,
): ApiRotationUpdateRequestPlayer => ({
  profile_id: rotationUpdateRequestPlayer.profileId,
  replacement_profile_id:
    rotationUpdateRequestPlayer.replacementProfileId ?? null,
  in_court_profile_id: rotationUpdateRequestPlayer.inCourtProfileId,
  position: rotationUpdateRequestPlayer.position,
  libero: rotationUpdateRequestPlayer.libero,
  change_windows: rotationUpdateRequestPlayer.changeWindows.length
    ? rotationUpdateRequestPlayer.changeWindows
    : null,
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
  currentChangeWindow: apiRotation.current_change_window,

  players: apiRotation.players
    ? apiRotation.players.map(mapApiRotationPlayerToRotationPlayer)
    : [],
  call: apiRotation.call ? mapApiCallToCall(apiRotation.call) : undefined,
  set: apiRotation.set ? mapApiSetToSet(apiRotation.set) : undefined,
  game: apiRotation.game ? mapApiGameToGame(apiRotation.game) : undefined,
  team: apiRotation.team ? mapApiTeamToTeam(apiRotation.team) : undefined,
  setSanctions: apiRotation.set_sanctions
    ? apiRotation.set_sanctions.map(mapApiSanctionToSanction)
    : undefined,
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
      changeWindow: player.changeWindows[0],
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
        changeWindow: player.changeWindows[1],
      })
    }
  }

  return playerChanges
}

export const mapRotationToRotationWindowPlayerChanges = (
  rotation: Rotation,
  callPlayersData: CallPlayerData[],
): RotationWindowPlayerChange[] => {
  const playerChanges: RotationPlayerChange[] =
    mapRotationToRotationPlayerChanges(rotation, callPlayersData)

  return Array.from(
    { length: Math.max(...playerChanges.map(change => change.changeWindow)) },
    (_, i) => i + 1,
  ).map(changeWindow => ({
    [changeWindow]: playerChanges.filter(
      change => change.changeWindow === changeWindow,
    ),
  }))
}

export const playerChangeCanBeRemovedOLD = (
  playerChange: RotationPlayerChange,
  playerChanges: RotationPlayerChange[],
): boolean =>
  !!playerChanges.find(
    pc =>
      pc.in.profileId === playerChange.out.profileId &&
      pc.out.profileId === playerChange.in.profileId,
  )

export const playerChangeCanBeRemoved = (
  playerChange: RotationPlayerChange,
  currentChangeWindow: number,
): boolean => playerChange.changeWindow === currentChangeWindow - 1
