import {
  ApiCurrentRotation,
  ApiRotation,
  ApiRotationPlayer,
  ApiRotationPlayerDeniedChange,
  ApiRotationPlayerDeniedChangePlayerChange,
  ApiRotationUpdateRequest,
  ApiRotationUpdateRequestPlayer,
} from '@/types/api/rotation'
import { Game, mapApiGameToGame } from '@/domain/game'
import { Set, mapApiSetToSet } from '@/domain/set'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import {
  Call,
  CallPlayerData,
  getPlayerDataByProfileId,
  mapApiCallToCall,
} from '@/domain/call'
import { Sanction, mapApiSanctionToSanction } from '@/domain/sanction'
import { Injury, mapApiInjuryToInjury } from '@/domain/injury'

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

export const PLAYER_CHANGE_TYPES = {
  regular: 'regular',
  injury: 'injury',
} as const

export type PlayerChangeType = keyof typeof PLAYER_CHANGE_TYPES

export const ROTATION_PLAYER_STATUS = {
  pending: 'pending',
  approved: 'approved',
  denied: 'denied',
} as const

export type RotationPlayerStatus = keyof typeof ROTATION_PLAYER_STATUS

export type RotationPlayerDeniedChange = {
  deniedAt: string
  deniedBy: number
  denyReason: string | null
  changeWindow: number
  playerInProfileId: number
  playerOutProfileId: number
  injured: boolean
}

export type RotationPlayerRelations = {
  injuries?: Injury[]
  injuryReplacenent?: Injury
}

export type RotationPlayer = {
  id: number
  profileId: number
  rotationId: number
  replacementProfileId?: number
  inCourtProfileId: number
  position: number
  status: RotationPlayerStatus
  currentPosition: number
  libero: boolean
  injured: boolean
  injuredProfileId?: number
  injuryDescription?: string
  changeWindows: number[]
  deniedChanges?: RotationPlayerDeniedChange[]
  sanctionId?: number
} & RotationPlayerRelations

export type RotationRelations = {
  players: RotationPlayer[]
  call?: Call
  set?: Set
  game?: Game
  team?: Team
  setSanctions?: Sanction[]
  injuries?: Injury[]
}

export type Rotation = {
  id: number
  callId: number
  setId: number
  number: number
  inCourtCaptainProfileId: number
  requestedInCourtCaptainProfileId?: number
  playerChangesCount: number
  locked: boolean
  currentChangeWindow: number
} & RotationRelations

export type RotationUpdateRequestPlayer = {
  id: number
  profileId: number
  replacementProfileId: number
  inCourtProfileId: number
  position: number
  libero: boolean
  injured: boolean
  injuredProfileId?: number
  injuryDescription?: string
  changeWindows: number[]
}

export type RotationUpdateRequest = {
  changeWindow: number
  inCourtCaptainProfileId: number
  players: RotationUpdateRequestPlayer[]
}

export type CurrentRotation = {
  [profileId: number]: number
}

export type RotationPlayerChangeRequest = {
  id: number
  profileId: number
  replacementProfileId: number
  inCourtProfileId: number
  position: number
  status: RotationPlayerStatus
  libero: boolean
  injured: boolean
  injuredProfileId?: number
  injuryDescription?: string
  changeWindows: number[]
  comesFromApi: boolean
  denyReason?: string
  deniedAt?: Date
}

export type RotationPlayerChangeForm = {
  rotation: Rotation
  changes: RotationPlayerChangeRequest[]
}

export type RotationPlayerChange = {
  in: CallPlayerData
  out: CallPlayerData
  injured?: CallPlayerData
  changeWindow: number
}

export type RotationWindowPlayerChange = {
  [changeWindow: number]: RotationPlayerChange[]
}

export type PlayerChangeInOut = {
  in: CallPlayerData
  out: CallPlayerData
}

export const mapRotationPlayerToApiRotationPlayer = (
  rotationPlayer: RotationPlayer,
): ApiRotationPlayer => ({
  id: rotationPlayer.id,
  profile_id: rotationPlayer.profileId,
  rotation_id: rotationPlayer.rotationId,
  replacement_profile_id: rotationPlayer.replacementProfileId ?? null,
  in_court_profile_id: rotationPlayer.inCourtProfileId,
  position: rotationPlayer.position,
  status: rotationPlayer.status,
  current_position: rotationPlayer.currentPosition,
  libero: rotationPlayer.libero,
  injured: rotationPlayer.injured,
  injured_profile_id: rotationPlayer.injuredProfileId ?? null,
  injury_description: rotationPlayer.injuryDescription ?? null,
  change_windows: rotationPlayer.changeWindows.length
    ? rotationPlayer.changeWindows
    : null,
  denied_changes: rotationPlayer.deniedChanges
    ? rotationPlayer.deniedChanges.map(
        mapRotationPlayerDeniedChangeToApiRotationPlayerDeniedChange,
      )
    : null,
  sanction_id: rotationPlayer.sanctionId ?? null,
})

export const mapApiRotationPlayerToRotationPlayer = (
  apiRotationPlayer: ApiRotationPlayer,
): RotationPlayer => ({
  id: apiRotationPlayer.id,
  profileId: apiRotationPlayer.profile_id,
  rotationId: apiRotationPlayer.rotation_id,
  replacementProfileId: apiRotationPlayer.replacement_profile_id ?? undefined,
  inCourtProfileId: apiRotationPlayer.in_court_profile_id,
  position: apiRotationPlayer.position,
  status: apiRotationPlayer.status,
  currentPosition: apiRotationPlayer.current_position,
  libero: apiRotationPlayer.libero,
  injured: apiRotationPlayer.injured,
  injuredProfileId: apiRotationPlayer.injured_profile_id ?? undefined,
  injuryDescription: apiRotationPlayer.injury_description ?? undefined,
  changeWindows: apiRotationPlayer.change_windows ?? [],
  deniedChanges: apiRotationPlayer.denied_changes
    ? apiRotationPlayer.denied_changes.map(
        mapApiRotationPlayerDeniedChangeToRotationPlayerDeniedChange,
      )
    : undefined,
  sanctionId: apiRotationPlayer.sanction_id ?? undefined,
})

export const mapRotationPlayerChangeRequestToRotationUpdateRequestPlayer = (
  rotationPlayerChangeRequest: RotationPlayerChangeRequest,
): RotationUpdateRequestPlayer => ({
  id: rotationPlayerChangeRequest.id,
  profileId: rotationPlayerChangeRequest.profileId,
  replacementProfileId: rotationPlayerChangeRequest.replacementProfileId,
  inCourtProfileId: rotationPlayerChangeRequest.inCourtProfileId,
  position: rotationPlayerChangeRequest.position,
  libero: rotationPlayerChangeRequest.libero,
  injured: rotationPlayerChangeRequest.injured,
  injuredProfileId: rotationPlayerChangeRequest.injuredProfileId,
  injuryDescription: rotationPlayerChangeRequest.injuryDescription,
  changeWindows: rotationPlayerChangeRequest.changeWindows,
})

export const mapRotationPlayerToApiRotationPlayerChange = (
  rotationPlayer: RotationPlayer,
): ApiRotationUpdateRequestPlayer => ({
  id: rotationPlayer.id,
  profile_id: rotationPlayer.profileId,
  replacement_profile_id: rotationPlayer.replacementProfileId ?? null,
  in_court_profile_id: rotationPlayer.inCourtProfileId,
  position: rotationPlayer.position,
  libero: rotationPlayer.libero,
  injured: rotationPlayer.injured,
  injured_profile_id: rotationPlayer.injuredProfileId ?? null,
  injury_description: rotationPlayer.injuryDescription ?? null,
  change_windows: rotationPlayer.changeWindows.length
    ? rotationPlayer.changeWindows
    : null,
})

export const mapRotationUpdateRequestPlayerToApiRotationUpdateRequestPlayer = (
  rotationUpdateRequestPlayer: RotationUpdateRequestPlayer,
): ApiRotationUpdateRequestPlayer => ({
  id: rotationUpdateRequestPlayer.id,
  profile_id: rotationUpdateRequestPlayer.profileId,
  replacement_profile_id:
    rotationUpdateRequestPlayer.replacementProfileId ?? null,
  in_court_profile_id: rotationUpdateRequestPlayer.inCourtProfileId,
  position: rotationUpdateRequestPlayer.position,
  libero: rotationUpdateRequestPlayer.libero,
  injured: rotationUpdateRequestPlayer.injured,
  injured_profile_id: rotationUpdateRequestPlayer.injuredProfileId ?? null,
  injury_description: rotationUpdateRequestPlayer.injuryDescription ?? null,
  change_windows: rotationUpdateRequestPlayer.changeWindows.length
    ? rotationUpdateRequestPlayer.changeWindows
    : null,
})

export const mapApiRotationToRotation = (
  apiRotation: ApiRotation,
): Rotation => {
  console.log({ apiRotation })
  return {
    id: apiRotation.id,
    callId: apiRotation.call_id,
    setId: apiRotation.set_id,
    inCourtCaptainProfileId: apiRotation.in_court_captain_profile_id,
    requestedInCourtCaptainProfileId:
      apiRotation.requested_in_court_captain_profile_id ?? undefined,
    playerChangesCount: apiRotation.player_changes_count,
    number: apiRotation.number,
    locked: apiRotation.locked,
    currentChangeWindow: apiRotation.current_change_window,

    ...mapApiRotationRelationsToRotationRelations(apiRotation),
  }
}

export const mapApiRotationRelationsToRotationRelations = (
  apiRotation: ApiRotation,
): RotationRelations => ({
  players: apiRotation.players.map(mapApiRotationPlayerToRotationPlayer),
  call: apiRotation.call ? mapApiCallToCall(apiRotation.call) : undefined,
  set: apiRotation.set ? mapApiSetToSet(apiRotation.set) : undefined,
  game: apiRotation.game ? mapApiGameToGame(apiRotation.game) : undefined,
  team: apiRotation.team ? mapApiTeamToTeam(apiRotation.team) : undefined,
  setSanctions: apiRotation.set_sanctions
    ? apiRotation.set_sanctions.map(mapApiSanctionToSanction)
    : undefined,
  injuries: apiRotation.injuries
    ? apiRotation.injuries.map(mapApiInjuryToInjury)
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
  change_window: rotation.currentChangeWindow,
  in_court_captain_profile_id: rotation.inCourtCaptainProfileId,
  players: rotation.players.map(mapRotationPlayerToApiRotationPlayerChange),
})

export const mapRotationUpdateRequestToApiRotationUpdateRequest = (
  rotationUpdateRequest: RotationUpdateRequest,
): ApiRotationUpdateRequest => ({
  change_window: rotationUpdateRequest.changeWindow,
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

export const mapRotatonPlayerToChangeType = (
  rotationPlayer?: RotationPlayer,
): ChangeType =>
  rotationPlayer?.replacementProfileId
    ? rotationPlayer.profileId === rotationPlayer.inCourtProfileId
      ? ChangeType.SECOND
      : ChangeType.FIRST
    : ChangeType.NONE

export const mapRotationPlayersToRotationPlayerChanges = (
  players: RotationPlayer[],
  callPlayersData: CallPlayerData[],
): RotationPlayerChange[] => {
  const playerChanges: RotationPlayerChange[] = []

  for (let i = 0; i < players.length; i++) {
    const player = players[i]

    if (!player.replacementProfileId) continue

    const playerIn = callPlayersData.find(
      callPlayerData =>
        callPlayerData.profileId === player.replacementProfileId,
    )
    const playerOut = callPlayersData.find(
      callPlayerData => callPlayerData.profileId === player.profileId,
    )

    const playerInjured = player.injuredProfileId
      ? player.injuredProfileId === playerIn?.profileId
        ? playerIn
        : playerOut
      : undefined

    if (!playerIn || !playerOut) continue

    playerChanges.push({
      in: playerIn,
      out: playerOut,
      injured: playerInjured,
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

      const playerInjured = player.injuredProfileId
        ? player.injuredProfileId === playerIn?.profileId
          ? playerIn
          : playerOut
        : undefined

      if (!playerIn || !playerOut) continue

      playerChanges.push({
        in: playerIn,
        out: playerOut,
        injured: playerInjured,
        changeWindow: player.changeWindows[1],
      })
    }
  }

  return playerChanges
}

export const mapRotationToRotationPlayerChanges = (
  rotation: Rotation,
  callPlayersData: CallPlayerData[],
): RotationPlayerChange[] =>
  mapRotationPlayersToRotationPlayerChanges(rotation.players, callPlayersData)

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

export const mapApiRotationPlayerDeniedChangePlayerChangeToRotationPlayerChangeRequest =
  (
    apiDeniedChange: ApiRotationPlayerDeniedChangePlayerChange,
    denyReason?: string,
    deniedAt?: string,
  ): RotationPlayerChangeRequest => ({
    id: apiDeniedChange.id,
    profileId: apiDeniedChange.profile_id,
    replacementProfileId: apiDeniedChange.replacement_profile_id ?? undefined,
    inCourtProfileId: apiDeniedChange.in_court_profile_id,
    position: apiDeniedChange.position,
    status: 'denied',
    libero: apiDeniedChange.libero,
    injured: apiDeniedChange.injured,
    injuredProfileId: apiDeniedChange.injured_profile_id ?? undefined,
    injuryDescription: apiDeniedChange.injury_description ?? undefined,
    changeWindows: apiDeniedChange.change_windows ?? [],
    comesFromApi: apiDeniedChange.comes_from_api,
    denyReason,
    deniedAt: deniedAt ? new Date(deniedAt) : undefined,
  })

export const mapRotationPlayerChangeRequestToApiRotationPlayerDeniedChangePlayerChange =
  (
    playerChange: RotationPlayerChangeRequest,
  ): ApiRotationPlayerDeniedChangePlayerChange => ({
    id: playerChange.id,
    profile_id: playerChange.profileId,
    replacement_profile_id: playerChange.replacementProfileId ?? null,
    in_court_profile_id: playerChange.inCourtProfileId,
    position: playerChange.position,
    status: 'denied',
    libero: playerChange.libero,
    injured: playerChange.injured,
    injured_profile_id: playerChange.injuredProfileId ?? null,
    injury_description: playerChange.injuryDescription ?? null,
    change_windows: playerChange.changeWindows,
    comes_from_api: playerChange.comesFromApi,
  })

export const mapApiRotationPlayerDeniedChangeToRotationPlayerDeniedChange = (
  apiRotationPlayerDeniedChange: ApiRotationPlayerDeniedChange,
): RotationPlayerDeniedChange => ({
  deniedAt: apiRotationPlayerDeniedChange.denied_at,
  deniedBy: apiRotationPlayerDeniedChange.denied_by,
  denyReason: apiRotationPlayerDeniedChange.deny_reason,
  changeWindow: apiRotationPlayerDeniedChange.change_window,
  playerInProfileId: apiRotationPlayerDeniedChange.player_in_profile_id,
  playerOutProfileId: apiRotationPlayerDeniedChange.player_out_profile_id,
  injured: apiRotationPlayerDeniedChange.injured,
})

export const mapRotationPlayerDeniedChangeToApiRotationPlayerDeniedChange = (
  rotationPlayerDeniedChange: RotationPlayerDeniedChange,
): ApiRotationPlayerDeniedChange => ({
  denied_at: rotationPlayerDeniedChange.deniedAt,
  denied_by: rotationPlayerDeniedChange.deniedBy,
  deny_reason: rotationPlayerDeniedChange.denyReason,
  change_window: rotationPlayerDeniedChange.changeWindow,
  player_in_profile_id: rotationPlayerDeniedChange.playerInProfileId,
  player_out_profile_id: rotationPlayerDeniedChange.playerOutProfileId,
  injured: rotationPlayerDeniedChange.injured,
})

export const mapDeniedPlayerChangeToPlayerInOut = (
  deniedPlayerChange: RotationPlayerDeniedChange,
  playersData: CallPlayerData[],
): Omit<RotationPlayerChange, 'changeWindow'> | undefined => {
  const playerIn = getPlayerDataByProfileId(
    playersData,
    deniedPlayerChange.playerInProfileId,
  )
  const playerOut = getPlayerDataByProfileId(
    playersData,
    deniedPlayerChange.playerOutProfileId,
  )

  if (!playerIn || !playerOut) return

  return {
    in: playerIn,
    out: playerOut,
  }
}

export const mapRotationPlayerToFakeInjury = (
  rotationPlayer: RotationPlayer,
): Injury | undefined => {
  if (!rotationPlayer.replacementProfileId) return

  return {
    id: 0,
    gameId: 0,
    setId: 0,
    rotationId: rotationPlayer.rotationId,
    teamId: 0,
    playerRotationId: rotationPlayer.id,
    profileId: rotationPlayer.injuredProfileId ?? rotationPlayer.profileId,
    replacementProfileId: rotationPlayer.replacementProfileId,
    libero: false,
    description: rotationPlayer.injuryDescription ?? '',
    isPlayerChangeInjury: true,
  }
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

export const getRotationsByCallId = (
  rotations: Rotation[],
  callId: number,
): Rotation[] => {
  return rotations.filter(rotation => rotation.callId === callId)
}

export const playerInProfileId = (playerChange?: RotationPlayer): number => {
  if (!playerChange) return 0

  return playerChange.profileId === playerChange.inCourtProfileId
    ? playerChange.profileId
    : playerChange.replacementProfileId ?? 0
}

export const playerOutProfileId = (playerChange?: RotationPlayer): number => {
  if (!playerChange) return 0

  return playerChange.profileId === playerChange.inCourtProfileId
    ? playerChange.replacementProfileId ?? 0
    : playerChange.profileId
}

export const getRotationPlayerInjury = (
  rotationPlayer?: RotationPlayer,
  injuries?: Injury[],
): Injury | undefined => {
  if (!rotationPlayer || !injuries) return

  return injuries.find(
    injury =>
      injury.rotationId === rotationPlayer.rotationId &&
      (injury.profileId === rotationPlayer.profileId ||
        injury.replacementProfileId === rotationPlayer.replacementProfileId),
  )
}

export const isPlayerInjured = (
  profileId: number,
  rotationPlayers: RotationPlayer[],
  injuries?: Injury[],
): boolean =>
  injuries?.some(injury => injury.profileId === profileId) ||
  rotationPlayers.some(player => player.injuredProfileId === profileId)

export const isPlayerReplacingInjured = (
  profileId: number,
  rotationPlayers: RotationPlayer[],
  injuries?: Injury[],
): boolean =>
  !isPlayerInjured(profileId, rotationPlayers, injuries) &&
  (injuries?.some(injury => injury.replacementProfileId === profileId) ||
    rotationPlayers.some(
      player => player.replacementProfileId === profileId && player.injured,
    ))
