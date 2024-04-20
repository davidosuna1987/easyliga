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

export type TeamRelations = {
  club?: Club
  sede?: Sede
  division?: Division
  category?: Category
  gender?: Gender
  coach?: User
  players?: Player[]
}

export type Team = {
  id: number
  name: string
  clubId?: number
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

export const TeamMemberTypes = {
  COACH: 'E',
} as const

export const mapApiTeamToTeam = (
  apiTeam: ApiTeam,
  withProfiles: boolean = false,
): Team => ({
  id: apiTeam.id,
  name: apiTeam.name,
  clubId: apiTeam.club_id ?? undefined,
  club: apiTeam.club ? mapApiClubToClub(apiTeam.club) : undefined,
  sede: apiTeam.sede ? mapApiSedeToSede(apiTeam.sede) : undefined,
  division: apiTeam.division
    ? mapApiDivisionToDivision(apiTeam.division)
    : undefined,
  category: apiTeam.category
    ? mapApiCategoryToCategory(apiTeam.category)
    : undefined,
  gender: apiTeam.gender ? mapApiGenderToGender(apiTeam.gender) : undefined,
  coach: apiTeam.coach ? mapApiUserToUser(apiTeam.coach) : undefined,
  players: apiTeam.players?.length
    ? mapApiPlayersToPlayers(apiTeam.players, withProfiles)
    : undefined,
})

export const mapTeamToApiTeamRequest = (team: Team): ApiTeamRequest => ({
  name: team.name,
  club_id: team.club?.id ?? null,
  sede_id: team.sede?.id ?? null,
  division_id: team.division?.id ?? null,
  category_id: team.category?.id ?? null,
  gender_id: team.gender?.id ?? null,
  coach_id: team.coach?.id ?? null,
  players: team.players ? team.players.map(mapPlayerToApiPlayerRequest) : null,
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
