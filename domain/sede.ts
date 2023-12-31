import { Address, mapApiAddressToAddress } from '@/domain/address'
import { Club, mapApiClubToClub } from '@/domain/club'
import { Responsible, mapApiProfileToResponsible } from '@/domain/profile'
import { ApiSede } from '@/types/api/sede'
import { Game, mapApiGameToGame } from '@/domain/game'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { Court, mapApiCourtToCourt } from '@/domain/court'

export type SedeRelations = {
  address?: Address
  club?: Club
  responsible?: Responsible
  courts?: Court[]
  teams?: Team[]
  games?: Game[]
}

export type Sede = {
  id: number
  name: string
  shortName?: string
  email?: string
  phone?: string
  website?: string
} & SedeRelations

export const mapApiSedeToSede = (apiSede: ApiSede): Sede => ({
  id: apiSede.id,
  name: apiSede.name,
  shortName: apiSede.short_name || undefined,
  email: apiSede.email || undefined,
  phone: apiSede.phone || undefined,
  website: apiSede.website || undefined,
  address: apiSede.address
    ? mapApiAddressToAddress(apiSede.address)
    : undefined,
  club: apiSede.club ? mapApiClubToClub(apiSede.club) : undefined,
  responsible: apiSede.responsible
    ? mapApiProfileToResponsible(apiSede.responsible)
    : undefined,
  courts: apiSede.courts ? apiSede.courts.map(mapApiCourtToCourt) : undefined,
  teams: apiSede.teams?.length
    ? apiSede.teams.map(mapApiTeamToTeam)
    : undefined,
  games: apiSede.games ? apiSede.games.map(mapApiGameToGame) : undefined,
})
