import { ApiSanction, ApiSanctionStoreRequest } from '@/types/api/sanction'
import { Game, mapApiGameToGame } from '@/domain/game'
import { Set, mapApiSetToSet } from '@/domain/set'
import { Point, mapApiPointToPoint } from '@/domain/point'
import { Profile, mapApiProfileToProfile } from '@/domain/profile'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { User, mapApiUserToUser } from '@/domain/user'

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

export const SanctionMember = {
  player: 'player',
  coach: 'coach',
}

export type SanctionMemberKey = keyof typeof SanctionMember

export const SANCTION_SEVERITY_TEAM = [
  SanctionSeverity.warning,
  SanctionSeverity.point,
] as SanctionSeverityKey[]

export const SANCTION_SEVERITY_MEMBER = [
  SanctionSeverity.warning,
  SanctionSeverity.point,
  SanctionSeverity.set,
  SanctionSeverity.game,
] as SanctionSeverityKey[]

export const POINT_AGAINST_SEVERITIES = [
  SanctionSeverity.point,
] as SanctionSeverityKey[]

export const EXPULSION_SEVERITIES = [
  SanctionSeverity.set,
  SanctionSeverity.game,
] as SanctionSeverityKey[]

export type SanctionRelations = {
  game?: Game
  set?: Set
  team?: Team
  point?: Point
  coach?: User
  player?: User
  coachProfile?: Profile
  playerProfile?: Profile
}

export type Sanction = {
  id: number
  type: SanctionTypeKey
  severity: SanctionSeverityKey
  setId: number
  teamId: number
  playerProfileId?: number
  coachProfileId?: number
  localTeamScore: number
  visitorTeamScore: number
  observations?: string
} & SanctionRelations

export type SanctionStoreRequest = {
  type?: SanctionTypeKey
  severity?: SanctionSeverityKey
  setId?: number
  teamId?: number
  playerProfileId?: number
  coachProfileId?: number
  observations?: string
}

export const mapApiSanctionToSanction = (
  apiSanction: ApiSanction,
): Sanction => ({
  id: apiSanction.id,
  type: apiSanction.type,
  severity: apiSanction.severity,
  setId: apiSanction.set_id,
  teamId: apiSanction.team_id,
  playerProfileId: apiSanction.player_profile_id ?? undefined,
  coachProfileId: apiSanction.coach_profile_id ?? undefined,
  localTeamScore: apiSanction.local_team_score,
  visitorTeamScore: apiSanction.visitor_team_score,
  observations: apiSanction.observations ?? undefined,

  game: apiSanction.game ? mapApiGameToGame(apiSanction.game) : undefined,
  set: apiSanction.set ? mapApiSetToSet(apiSanction.set) : undefined,
  team: apiSanction.team ? mapApiTeamToTeam(apiSanction.team) : undefined,
  point: apiSanction.point ? mapApiPointToPoint(apiSanction.point) : undefined,
  coach: apiSanction.coach ? mapApiUserToUser(apiSanction.coach) : undefined,
  player: apiSanction.player ? mapApiUserToUser(apiSanction.player) : undefined,
  coachProfile: apiSanction.coach_profile
    ? mapApiProfileToProfile(apiSanction.coach_profile)
    : undefined,
  playerProfile: apiSanction.player_profile
    ? mapApiProfileToProfile(apiSanction.player_profile)
    : undefined,
})

export const mapSanctionStoreRequestToApiSanctionStoreRequest = (
  sanction: SanctionStoreRequest,
): ApiSanctionStoreRequest => {
  if (!sanction.type) throw new Error('Sanction type is required')
  if (!sanction.severity) throw new Error('Sanction severity is required')
  if (!sanction.setId) throw new Error('Sanction set_id is required')
  if (!sanction.teamId) throw new Error('Sanction team_id is required')
  if (
    sanction.type === 'member' &&
    !sanction.playerProfileId &&
    !sanction.coachProfileId
  ) {
    throw new Error(
      'Sanction player_profile_id or coach_profile_id is required',
    )
  }

  return {
    type: sanction.type,
    severity: sanction.severity,
    set_id: sanction.setId,
    team_id: sanction.teamId,
    player_profile_id: sanction.playerProfileId,
    coach_profile_id: sanction.coachProfileId,
    observations: sanction.observations,
  }
}

export const getAvailableTeamSanctionSeverities = (
  sanctions?: Sanction[],
  setId?: number,
  teamId?: number,
): SanctionSeverityKey[] => {
  if (!sanctions) return SANCTION_SEVERITY_TEAM

  if (!setId || !teamId) return []

  const setTeamWarningSanctionsCount = sanctions.filter(
    sanction =>
      sanction.type === SanctionType.team &&
      sanction.severity === SanctionSeverity.warning &&
      sanction.setId === setId &&
      sanction.teamId === teamId,
  ).length

  return setTeamWarningSanctionsCount
    ? ([SanctionSeverity.point] as SanctionSeverityKey[])
    : SANCTION_SEVERITY_TEAM
}

export const getAvailableMemberSanctionSeverities = (
  sanctions?: Sanction[],
  setId?: number,
  teamId?: number,
  profileId?: number,
  memberType?: SanctionMemberKey,
): SanctionSeverityKey[] => {
  if (!sanctions) return SANCTION_SEVERITY_MEMBER

  if (!teamId || !profileId || !memberType) return []

  const memberSanctionsBySeverity = (severity: string): Sanction[] =>
    setTeamMemberSanctions.filter(sanction => sanction.severity === severity)

  const removeAvailableSeverities = (severities: string[]): void => {
    availableSanctionTypes = availableSanctionTypes.filter(
      s => !severities.includes(s),
    )
  }

  const setTeamMembersWarningSanctions = sanctions.filter(
    sanction =>
      sanction.type === SanctionType.member &&
      sanction.severity === SanctionSeverity.warning &&
      sanction.setId === setId &&
      sanction.teamId === teamId,
  )

  let availableSanctionTypes = SANCTION_SEVERITY_MEMBER

  const profileType =
    memberType === SanctionMember.player ? 'playerProfileId' : 'coachProfileId'

  const setTeamMemberSanctions = sanctions.filter(
    sanction =>
      sanction.type === SanctionType.member &&
      (sanction.severity === SanctionSeverity.game ||
        sanction.setId === setId) &&
      sanction.teamId === teamId &&
      sanction[profileType] === profileId,
  )

  if (setTeamMembersWarningSanctions.length) {
    removeAvailableSeverities([SanctionSeverity.warning])
  }

  if (memberSanctionsBySeverity(SanctionSeverity.point).length) {
    removeAvailableSeverities([
      SanctionSeverity.warning,
      SanctionSeverity.point,
    ])
  }

  if (memberSanctionsBySeverity(SanctionSeverity.set).length) {
    removeAvailableSeverities([
      SanctionSeverity.warning,
      SanctionSeverity.point,
      SanctionSeverity.set,
    ])
  }

  if (memberSanctionsBySeverity(SanctionSeverity.game).length) {
    removeAvailableSeverities([
      SanctionSeverity.warning,
      SanctionSeverity.point,
      SanctionSeverity.set,
      SanctionSeverity.game,
    ])
  }

  return availableSanctionTypes
}

export const getPlayerItemSanction = (
  sanctions?: Sanction[],
  setId?: number,
  teamId?: number,
  profileId?: number,
  memberType?: SanctionMemberKey,
  scope: 'set' | 'game' = 'set',
): Sanction | undefined => {
  if (
    !sanctions ||
    (!setId && scope === 'set') ||
    !teamId ||
    !profileId ||
    !memberType
  )
    return

  const profileType =
    memberType === SanctionMember.player ? 'playerProfileId' : 'coachProfileId'

  const setTeamMemberSanctions = sanctions.filter(
    sanction =>
      sanction.type === SanctionType.member &&
      sanction.teamId === teamId &&
      sanction[profileType] === profileId &&
      (scope === 'game' || (scope === 'set' && sanction.setId === setId)),
  )

  if (setTeamMemberSanctions.length) {
    const lastSanction =
      setTeamMemberSanctions[setTeamMemberSanctions.length - 1]

    return lastSanction
  }

  return undefined
}

export const isMembeSanction = (sanction: Sanction): boolean =>
  sanction.type === SanctionType.member && !!sanction.playerProfileId

export const mergeSanctionsRemovingDuplicates = (
  ...sanctions: Sanction[][]
): Sanction[] => {
  const mergedSanctions = sanctions.flat()

  const mergedSanctionsIds = mergedSanctions.map(sanction => sanction.id)

  return mergedSanctions.filter(
    (sanction, index) => mergedSanctionsIds.indexOf(sanction.id) === index,
  )
}
