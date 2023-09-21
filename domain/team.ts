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
import { Profile, mapApiProfileToProfile } from '@/domain/profile'
import { Division, mapApiDivisionToDivision } from '@/domain/division'

export enum TeamType {
  LOCAL = 'local',
  VISITOR = 'visitor',
}

export type TeamRelations = {
  division?: Division
  category?: Category
  gender?: Gender
  coach?: Profile
  players?: Player[]
}

export type Team = {
  id: number
  name: string
} & TeamRelations

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
  coach: apiTeam.coach ? mapApiProfileToProfile(apiTeam.coach) : undefined,
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
