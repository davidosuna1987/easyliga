import { Player, mapApiPlayersToPlayers } from '@/domain/player'
import { ApiTeam } from '@/types/api/team'

export type TeamType = 'local' | 'visitor'

// TODO: add coach
export type Team = {
  id: number
  name: string
  // coach: Player
  players: Player[]
}

export const mapApiTeamToTeam = (apiTeam: ApiTeam): Team => ({
  id: apiTeam.id,
  name: apiTeam.name,
  players: mapApiPlayersToPlayers(apiTeam.players),
})
