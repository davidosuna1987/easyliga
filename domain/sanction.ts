export enum SanctionType {
  team = 'team',
  member = 'member',
}

export type SanctionTypeKey = keyof typeof SanctionType

export enum SanctionIcon {
  team = 'ph:users-three-fill',
  member = 'ph:user-fill',
}

export const SanctionSeverity = {
  warning: 'warning',
  point: 'point',
  set: 'set',
  game: 'game',
}

export type SanctionSeverityKey = keyof typeof SanctionSeverity

export const SANCTION_SEVERITY_TEAM = [
  SanctionSeverity.warning,
  SanctionSeverity.point,
]

export const SANCTION_SEVERITY_MEMBER = [
  SanctionSeverity.warning,
  SanctionSeverity.point,
  SanctionSeverity.set,
  SanctionSeverity.game,
]

export type SanctionStoreRequest = {
  type?: SanctionTypeKey
  severity?: SanctionSeverityKey
  setId?: number
  teamId?: number
  playerProfileId?: number
  coachProfileId?: number
  observations?: string
}
