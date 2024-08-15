import {
  Player,
  mapApiPlayersToPlayers,
  mapPlayerToApiPlayerRequest,
} from '@/domain/player'
import { ApiTeam, ApiTeamRequest } from '@/types/api/team'
import {
  Category,
  Gender,
  mapApiCategoryToCategory,
  mapApiGenderToGender,
} from '@/domain/game'
import { Sede, mapApiSedeToSede } from '@/domain/sede'
import { Division, mapApiDivisionToDivision } from '@/domain/division'
import { Profile } from '@/domain/profile'
import { CallPlayerData } from '@/domain/call'
import { Club, mapApiClubToClub } from '@/domain/club'
import { User, mapApiUserToUser } from '@/domain/user'
import { License, mapApiLicenseToLicense } from '@/domain/license'
import { Federation, mapApiFederationToFederation } from '@/domain/federation'

export type TeamRelations = {
  club?: Club
  sede?: Sede
  sedes?: Sede[]
  division?: Division
  federation?: Federation
  category?: Category
  gender?: Gender
  coach?: User
  substituteCoaches?: User[]
  players?: Player[]
  licenses?: License[]
}

export type Team = {
  id: number
  name: string
  clubId?: number
  sedeId?: number
  divisionId?: number
  categoryId?: number
  genderId?: number
  coachId?: number
  shirtColor?: ShirtColor
} & TeamRelations

export enum TeamType {
  LOCAL = 'local',
  VISITOR = 'visitor',
}

export enum TeamSideEnum {
  left = 'left',
  right = 'right',
}

export type TeamSide = keyof typeof TeamSideEnum

export type Coach = Profile & { coach: boolean }

export type TeamMember = {
  profileId: number
  firstName: string
  lastName: string
  shirtNumber?: number
  avatar?: string
  captain?: boolean
  libero?: boolean
  coach: boolean
}

export type TeamFormRequest = {
  id: number
  name: string
  clubId: number | undefined
  sedeId: number | undefined
  divisionId: number | undefined
  categoryId: number | undefined
  genderId: number | undefined
  coachId: number | undefined
  substituteCoachesIds?: number[]
  players: Player[]
  shirtColor?: ShirtColor
}

export const TeamMemberTypes = {
  COACH: 'E',
} as const

export const SHIRT_COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'brown',
  'gray',
  'black',
  'white',
] as const

export type ShirtColor = (typeof SHIRT_COLORS)[number]

export type CustomTeamsShirtColor = {
  left: ShirtColor | undefined
  right: ShirtColor | undefined
}

export const mapApiTeamToTeam = (
  apiTeam: ApiTeam,
  withProfiles: boolean = false,
): Team => ({
  id: apiTeam.id,
  name: apiTeam.name,
  clubId: apiTeam.club_id ?? undefined,
  sedeId: apiTeam.sede_id ?? undefined,
  divisionId: apiTeam.division_id ?? undefined,
  categoryId: apiTeam.category_id ?? undefined,
  genderId: apiTeam.gender_id ?? undefined,
  coachId: apiTeam.coach_id ?? undefined,
  shirtColor: apiTeam.shirt_color ?? undefined,

  ...mapApiTeamRelationsToTeamRelations(apiTeam, withProfiles),
})

export const mapApiTeamRelationsToTeamRelations = (
  apiTeam: ApiTeam,
  withProfiles: boolean = false,
): TeamRelations => ({
  club: apiTeam.club ? mapApiClubToClub(apiTeam.club) : undefined,
  sede: apiTeam.sede ? mapApiSedeToSede(apiTeam.sede) : undefined,
  sedes: apiTeam.sedes ? apiTeam.sedes.map(mapApiSedeToSede) : undefined,
  division: apiTeam.division
    ? mapApiDivisionToDivision(apiTeam.division)
    : undefined,
  federation: apiTeam.federation
    ? mapApiFederationToFederation(apiTeam.federation)
    : undefined,
  category: apiTeam.category
    ? mapApiCategoryToCategory(apiTeam.category)
    : undefined,
  gender: apiTeam.gender ? mapApiGenderToGender(apiTeam.gender) : undefined,
  coach: apiTeam.coach ? mapApiUserToUser(apiTeam.coach) : undefined,
  substituteCoaches: apiTeam.substitute_coaches
    ? apiTeam.substitute_coaches.map(mapApiUserToUser)
    : undefined,
  players: apiTeam.players?.length
    ? mapApiPlayersToPlayers(apiTeam.players, withProfiles)
    : undefined,
  licenses: apiTeam.licenses
    ? apiTeam.licenses.map(mapApiLicenseToLicense)
    : undefined,
})

export const mapTeamFormRequestToApiTeamRequest = (
  teamFormRequest: TeamFormRequest,
): ApiTeamRequest => ({
  name: teamFormRequest.name,
  club_id: teamFormRequest.clubId ?? null,
  sede_id: teamFormRequest.sedeId ?? null,
  division_id: teamFormRequest.divisionId ?? null,
  category_id: teamFormRequest.categoryId ?? null,
  gender_id: teamFormRequest.genderId ?? null,
  coach_id: teamFormRequest.coachId ?? null,
  substitute_coaches_ids: teamFormRequest.substituteCoachesIds ?? null,
  players: teamFormRequest.players
    ? teamFormRequest.players.map(mapPlayerToApiPlayerRequest)
    : null,
  shirt_color: teamFormRequest.shirtColor ?? null,
})

export const mapProfileToTeamMember = (
  profile: Profile,
  coach: boolean,
): TeamMember => ({
  profileId: profile.id,
  firstName: profile.firstName,
  lastName: profile.lastName,
  avatar: profile.avatar,
  coach,
})

export const mapCallPlayerDataToTeamMember = (
  callPlayerData: CallPlayerData,
): TeamMember => ({
  profileId: callPlayerData.profileId,
  firstName: callPlayerData.firstName,
  lastName: callPlayerData.lastName,
  shirtNumber: callPlayerData.shirtNumber,
  avatar: callPlayerData.avatar,
  coach: false,
})

export const mapTeamToTeamFormRequest = (
  team?: Team,
  clubId = 0,
): TeamFormRequest => ({
  id: team?.id ?? 0,
  name: team?.name ?? '',
  clubId: team?.clubId ?? clubId,
  sedeId: team?.sedeId ?? undefined,
  divisionId: team?.divisionId ?? undefined,
  categoryId: team?.categoryId ?? undefined,
  genderId: team?.genderId ?? undefined,
  coachId: team?.coachId ?? undefined,
  substituteCoachesIds: team?.substituteCoaches?.map(coach => coach.id) ?? [],
  players: team?.players ?? [],
  shirtColor: team?.shirtColor ?? undefined,
})
