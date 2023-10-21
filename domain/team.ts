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
import { Profile, mapApiProfileToCoach } from '@/domain/profile'
import { Division, mapApiDivisionToDivision } from '@/domain/division'
import { CallPlayerData } from '@/domain/call'

export type TeamRelations = {
  division?: Division
  category?: Category
  gender?: Gender
  coach?: Coach
  players?: Player[]
}

export type Team = {
  id: number
  name: string
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

export const mapApiTeamToTeam = (apiTeam: ApiTeam): Team => ({
  id: apiTeam.id,
  name: apiTeam.name,
  division: apiTeam.division
    ? mapApiDivisionToDivision(apiTeam.division)
    : undefined,
  category: apiTeam.category
    ? mapApiCategoryToCategory(apiTeam.category)
    : undefined,
  gender: apiTeam.gender ? mapApiGenderToGender(apiTeam.gender) : undefined,
  coach: apiTeam.coach ? mapApiProfileToCoach(apiTeam.coach) : undefined,
  players: apiTeam.players?.length
    ? mapApiPlayersToPlayers(apiTeam.players)
    : undefined,
})

export const mapTeamToApiTeamRequest = (team: Team): ApiTeamRequest => ({
  name: team.name,
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
