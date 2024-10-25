import { Game, mapApiGameToGame } from '@/domain/game'
import { mapApiSetToSet, Set } from '@/domain/set'
import {
  mapApiRotationToRotation,
  Rotation,
  RotationPlayerChange,
} from '@/domain/rotation'
import { mapApiTeamToTeam, Team } from '@/domain/team'
import { mapApiProfileToProfile, Profile } from '@/domain/profile'
import { ApiInjury, ApiInjuryFormRequest } from '@/types/api/injury'
import { CallPlayerData, getPlayerDataByProfileId } from '@/domain/call'

export const INJURY_DESCRIPTION_MIN_LENGTH = 3

export type InjuryRelations = {
  game?: Game
  set?: Set
  rotation?: Rotation
  team?: Team
  profile?: Profile
  replacement_profile?: Profile
  playerIn?: Profile
  playerOut?: Profile
}

export type Injury = {
  id: number
  gameId: number
  setId: number
  rotationId: number
  teamId: number
  playerRotationId: number
  profileId: number
  replacementProfileId: number
  libero: boolean
  description: string
  isPlayerChangeInjury?: boolean
} & InjuryRelations

export type InjuryFormRequest = {
  gameId: number
  setId: number
  rotationId: number
  teamId: number
  injuries: {
    playerRotationId: number
    profileId: number
    replacementProfileId: number
    libero: boolean
    description: string
    playerInShirtNumber?: number
    playerOutShirtNumber?: number
  }[]
}

export const mapApiInjuryToInjury = (apiInjury: ApiInjury): Injury => ({
  id: apiInjury.id,
  gameId: apiInjury.game_id,
  setId: apiInjury.set_id,
  rotationId: apiInjury.rotation_id,
  teamId: apiInjury.team_id,
  playerRotationId: apiInjury.player_rotation_id,
  profileId: apiInjury.profile_id,
  replacementProfileId: apiInjury.replacement_profile_id,
  libero: apiInjury.libero,
  description: apiInjury.description,

  ...mapApiInjuryRelationsToInjuryRelations(apiInjury),
})

export const mapApiInjuryRelationsToInjuryRelations = (
  apiInjury: ApiInjury,
): InjuryRelations => ({
  game: apiInjury.game ? mapApiGameToGame(apiInjury.game) : undefined,
  set: apiInjury.set ? mapApiSetToSet(apiInjury.set) : undefined,
  rotation: apiInjury.rotation
    ? mapApiRotationToRotation(apiInjury.rotation)
    : undefined,
  team: apiInjury.team ? mapApiTeamToTeam(apiInjury.team) : undefined,
  profile: apiInjury.profile
    ? mapApiProfileToProfile(apiInjury.profile)
    : undefined,
  replacement_profile: apiInjury.replacement_profile
    ? mapApiProfileToProfile(apiInjury.replacement_profile)
    : undefined,
  playerIn: apiInjury.playerIn
    ? mapApiProfileToProfile(apiInjury.playerIn)
    : undefined,
  playerOut: apiInjury.playerOut
    ? mapApiProfileToProfile(apiInjury.playerOut)
    : undefined,
})

export const mapInjuryFormRequestToApiInjuryRequest = (
  injuryFormRequest: InjuryFormRequest,
): ApiInjuryFormRequest => ({
  game_id: injuryFormRequest.gameId,
  set_id: injuryFormRequest.setId,
  rotation_id: injuryFormRequest.rotationId,
  team_id: injuryFormRequest.teamId,
  injuries: injuryFormRequest.injuries.map(injury => ({
    player_rotation_id: injury.playerRotationId,
    profile_id: injury.profileId,
    replacement_profile_id: injury.replacementProfileId,
    libero: injury.libero,
    description: injury.description,
    player_in_shirt_number: injury.playerInShirtNumber,
    player_out_shirt_number: injury.playerOutShirtNumber,
  })),
})

export const isValidInjuryFormRequest = (
  injuryFormRequest?: InjuryFormRequest,
): boolean =>
  injuryFormRequest !== undefined &&
  injuryFormRequest.gameId !== undefined &&
  injuryFormRequest.setId !== undefined &&
  injuryFormRequest.rotationId !== undefined &&
  injuryFormRequest.teamId !== undefined &&
  !injuryFormRequest.injuries.some(
    injury => !isValidInjuryFormRequestInjury(injury),
  )

export const isValidInjuryFormRequestInjury = (
  injuryFormRequestInjury: InjuryFormRequest['injuries'][number],
): boolean =>
  injuryFormRequestInjury.playerRotationId !== undefined &&
  injuryFormRequestInjury.profileId !== undefined &&
  injuryFormRequestInjury.replacementProfileId !== undefined &&
  injuryFormRequestInjury.description !== undefined &&
  injuryFormRequestInjury.description.length >= INJURY_DESCRIPTION_MIN_LENGTH

export const getInvalidInjuryFormRequestTranslationKey = (
  injuryFormRequest?: InjuryFormRequest,
): string | undefined => {
  if (isValidInjuryFormRequest(injuryFormRequest)) return
  if (!injuryFormRequest) return 'errors.injuries.formRequest'
  if (!injuryFormRequest.gameId) return 'errors.injuries.gameId'
  if (!injuryFormRequest.setId) return 'errors.injuries.setId'
  if (!injuryFormRequest.rotationId) return 'errors.injuries.rotationId'
  if (!injuryFormRequest.teamId) return 'errors.injuries.teamId'
  // if (
  //   injuryFormRequest.injuries.find(
  //     injury => !isValidInjuryFormRequestInjury(injury),
  //   )
  // )
  //   return getInvalidInjuryFormRequestInjuriesTranslationKey(
  //     injuryFormRequest.injuries,
  //   )

  return
}

export const getInvalidInjuryFormRequestInjuriesTranslationKey = (
  injuryFormRequestInjuries?: InjuryFormRequest['injuries'],
): string | undefined => {
  if (!injuryFormRequestInjuries) return 'errors.injuries.injuries'
  for (const injuryFormRequestInjury of injuryFormRequestInjuries) {
    if (isValidInjuryFormRequestInjury(injuryFormRequestInjury)) continue
    if (!injuryFormRequestInjury.playerRotationId)
      return 'errors.injuries.playerRotationId'
    if (!injuryFormRequestInjury.profileId) return 'errors.injuries.profileId'
    if (!injuryFormRequestInjury.replacementProfileId)
      return 'errors.injuries.replacementProfileId'
    if (!injuryFormRequestInjury.description)
      return 'errors.injuries.description'
    if (
      injuryFormRequestInjury.description.length < INJURY_DESCRIPTION_MIN_LENGTH
    )
      return 'errors.injuries.description_min_length'
  }

  return
}

export const mapInjuryToPlayerInOut = (
  injury: Injury,
  playersData: CallPlayerData[],
): Omit<RotationPlayerChange, 'changeWindow'> | undefined => {
  const playerIn = getPlayerDataByProfileId(
    playersData,
    injury.replacementProfileId,
  )
  const playerOut = getPlayerDataByProfileId(playersData, injury.profileId)

  if (!playerIn || !playerOut) return

  return {
    in: playerIn,
    out: playerOut,
    injured: playerOut,
  }
}

export const isPlayerInjured = (
  profileId: number,
  injuries?: Injury[],
): boolean => injuries?.some(injury => injury.profileId === profileId) ?? false

export const getInjuryProfileIdByProfileId = (
  profileId: number,
  injuries?: Injury[],
): number | undefined =>
  injuries?.find(injury => injury.profileId === profileId)?.profileId

export const getInjuryReplacementProfileIdByProfileId = (
  profileId: number,
  injuries?: Injury[],
): number | undefined =>
  injuries?.find(injury => injury.profileId === profileId)?.replacementProfileId
