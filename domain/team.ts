import {
  Player,
  mapApiPlayersToPlayers,
  mapPlayerToApiPlayerRequest,
} from '@/domain/player'
import { ApiTeam, ApiTeamRequest } from '@/types/api/team'
import {
  Category,
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

export type TeamRelations = {
  club?: Club
  sede?: Sede
  sedes?: Sede[]
  division?: Division
  category?: Category
  gender?: {
    id: number
    name: 'masculine' | 'femenine' | 'mixed'
  }
  coach?: User
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
  club: apiTeam.club ? mapApiClubToClub(apiTeam.club) : undefined,
  sede: apiTeam.sede ? mapApiSedeToSede(apiTeam.sede) : undefined,
  sedes: apiTeam.sedes ? apiTeam.sedes.map(mapApiSedeToSede) : undefined,
  division: apiTeam.division
    ? mapApiDivisionToDivision(apiTeam.division)
    : undefined,
  category: apiTeam.category
    ? mapApiCategoryToCategory(apiTeam.category)
    : undefined,
  gender: apiTeam.gender ?? undefined,
  coach: apiTeam.coach ? mapApiUserToUser(apiTeam.coach) : undefined,
  players: apiTeam.players?.length
    ? mapApiPlayersToPlayers(apiTeam.players, withProfiles)
    : undefined,
  licenses: apiTeam.licenses
    ? apiTeam.licenses.map(mapApiLicenseToLicense)
    : undefined,
  shirtColor: apiTeam.shirt_color ?? undefined,
})

export const mapTeamToApiTeamRequest = (team: Team): ApiTeamRequest => ({
  name: team.name,
  club_id: team.clubId ?? null,
  sede_id: team.sedeId ?? null,
  division_id: team.divisionId ?? null,
  category_id: team.categoryId ?? null,
  gender_id: team.genderId ?? null,
  coach_id: team.coachId ?? null,
  players: team.players ? team.players.map(mapPlayerToApiPlayerRequest) : null,
  shirt_color: team.shirtColor ?? null,
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
  players: team?.players ?? [],
  shirtColor: team?.shirtColor ?? undefined,
})
