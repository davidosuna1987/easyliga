import {
  ApiCurrentRotation,
  ApiRotation,
  ApiRotationPlayer,
} from '@/types/api/rotation'

export type RotationPlayer = {
  profileId: number
  rotationId: number
  replacementProfileId: number | null
  inCourtProfileId: number
  position: number
  libero: boolean
}

export type Rotation = {
  id: number
  callId: number
  setId: number
  number: number
  locked: boolean
  players: RotationPlayer[]
}

export type CurrentRotation = {
  [profileId: number]: number
}

export const mapRotationPlayerToApiRotationPlayer = (
  rotationPlayer: RotationPlayer,
): ApiRotationPlayer => {
  return {
    profile_id: rotationPlayer.profileId,
    rotation_id: rotationPlayer.rotationId,
    replacement_profile_id: rotationPlayer.replacementProfileId,
    in_court_profile_id: rotationPlayer.inCourtProfileId,
    position: rotationPlayer.position,
    libero: rotationPlayer.libero,
  }
}

export const mapApiRotationPlayerToRotationPlayer = (
  apiRotationPlayer: ApiRotationPlayer,
): RotationPlayer => {
  return {
    profileId: apiRotationPlayer.profile_id,
    rotationId: apiRotationPlayer.rotation_id,
    replacementProfileId: apiRotationPlayer.replacement_profile_id,
    inCourtProfileId: apiRotationPlayer.in_court_profile_id,
    position: apiRotationPlayer.position,
    libero: apiRotationPlayer.libero,
  }
}

export const mapApiRotationToRotation = (
  apiRotation: ApiRotation,
): Rotation => {
  return {
    id: apiRotation.id,
    callId: apiRotation.call_id,
    setId: apiRotation.set_id,
    number: apiRotation.number,
    locked: apiRotation.locked,
    players: apiRotation.players
      ? apiRotation.players.map(mapApiRotationPlayerToRotationPlayer)
      : [],
  }
}

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
