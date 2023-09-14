import { Player, mapApiPlayersToPlayers } from '@/domain/player'
import { ApiTeam } from '@/types/api/team'
import {
  Category,
  Gender,
  mapApiCategoryToCategory,
  mapApiGenderToGender,
} from '@/domain/game'

export enum TeamType {
  LOCAL = 'local',
  VISITOR = 'visitor',
}

export type TeamRelations = {
  players?: Player[]
  category?: Category
  gender?: Gender
}

// TODO: add coach
export type Team = {
  id: number
  name: string
} & TeamRelations

export const mapApiTeamToTeam = (apiTeam: ApiTeam): Team => ({
  id: apiTeam.id,
  name: apiTeam.name,
  players: apiTeam.players?.length
    ? mapApiPlayersToPlayers(apiTeam.players)
    : undefined,
  category: apiTeam.category
    ? mapApiCategoryToCategory(apiTeam.category)
    : undefined,
  gender: apiTeam.gender ? mapApiGenderToGender(apiTeam.gender) : undefined,
})
