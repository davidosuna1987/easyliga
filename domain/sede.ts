import {
  Address,
  mapAddressToApiAddress,
  mapApiAddressToAddress,
} from '@/domain/address'
import { Club, mapApiClubToClub } from '@/domain/club'
import { ApiSede, ApiSedeRequest } from '@/types/api/sede'
import { Game, mapApiGameToGame } from '@/domain/game'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { Court, mapApiCourtToCourt } from '@/domain/court'
import { User, mapApiUserToUser } from '@/domain/user'

export type SedeRelations = {
  address?: Address
  club?: Club
  responsible?: User
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
  clubId?: number
  responsibleId?: number
} & SedeRelations

export type SedeRequest = {
  id: number
  name: string
  shortName?: string
  email?: string
  phone?: string
  website?: string
  address?: Address
  clubId?: number
  responsibleId?: number
}

export type SedeFormRef = {
  handleSubmit: () => void
  loadingApi: boolean
}

export const mapApiSedeToSede = (apiSede: ApiSede): Sede => ({
  id: apiSede.id,
  name: apiSede.name,
  shortName: apiSede.short_name || undefined,
  email: apiSede.email || undefined,
  phone: apiSede.phone || undefined,
  website: apiSede.website || undefined,
  clubId: apiSede.club_id || undefined,
  responsibleId: apiSede.responsible_id || undefined,

  address: apiSede.address
    ? mapApiAddressToAddress(apiSede.address)
    : undefined,
  club: apiSede.club ? mapApiClubToClub(apiSede.club) : undefined,
  responsible: apiSede.responsible
    ? mapApiUserToUser(apiSede.responsible)
    : undefined,
  courts: apiSede.courts ? apiSede.courts.map(mapApiCourtToCourt) : undefined,
  teams: apiSede.teams?.length
    ? apiSede.teams.map(team => mapApiTeamToTeam(team))
    : undefined,
  games: apiSede.games ? apiSede.games.map(mapApiGameToGame) : undefined,
})

export const mapSedeToSedeRequest = (sede?: Sede): SedeRequest => ({
  id: sede?.id || 0,
  name: sede?.name || '',
  shortName: sede?.shortName || undefined,
  email: sede?.email || undefined,
  phone: sede?.phone || undefined,
  website: sede?.website || undefined,
  address: sede?.address || undefined,
  responsibleId: sede?.responsible?.id || undefined,
  clubId: sede?.clubId || undefined,
})

export const mapSedeRequestToApiSedeRequest = (
  sedeRequest: SedeRequest,
): ApiSedeRequest => ({
  id: sedeRequest.id,
  name: sedeRequest.name,
  short_name: sedeRequest.shortName || null,
  email: sedeRequest.email || null,
  phone: sedeRequest.phone || null,
  website: sedeRequest.website || null,
  club_id: sedeRequest.clubId || null,
  responsible_id: sedeRequest.responsibleId || null,
  address: sedeRequest.address
    ? mapAddressToApiAddress(sedeRequest.address)
    : null,
})
