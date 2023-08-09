import { ApiPlayer } from '@/types/api/auth'
import { Player } from '@/domain//game'

export const mapApiPlayersToPlayers = (
  apiPlayers: ApiPlayer[] | undefined,
): Player[] => {
  if (!apiPlayers) return []

  return apiPlayers.map(apiPlayer => ({
    id: apiPlayer.id,
    firstName: apiPlayer.first_name,
    lastName: apiPlayer.last_name ?? undefined,
    avatar: apiPlayer.avatar ?? undefined,
    shirtNumber: apiPlayer.pivot.shirt_number,
    captain: apiPlayer.pivot.captain,
    libero: apiPlayer.pivot.libero,
  }))
}
