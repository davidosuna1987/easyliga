import { Player } from '@/domain/player'

export type TeamType = 'local' | 'visitor'

// TODO: add coach
export type Team = {
  id: number
  name: string
  // coach: Player
  players: Player[]
}
