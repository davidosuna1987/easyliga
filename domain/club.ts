import { Federation, mapApiFederationToFederation } from '@/domain/federation'
import { Game } from '@/domain/game'
import { Sede, mapApiSedeToSede } from '@/domain/sede'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { Address, mapApiAddressToAddress } from '@/domain/address'
import { ApiClub } from '@/types/api/club'
import { License, mapApiLicenseToLicense } from '@/domain/license'
import { User, mapApiUserToUser } from '@/domain/user'

export type ClubRelations = {
  address?: Address
  sedes?: Sede[]
  federation?: Federation
  responsible?: User
  teams?: Team[]
  games?: Game[]
  licenses?: License[]
}

export type ClubCountRelations = {
  sedesCount?: number
  teamsCount?: number
  gamesCount?: number
  licensesCount?: number
}

export type Club = {
  id: number
  federationId?: number
  responsibleId?: number
  addressId?: number
  name: string
  shortName?: string
  email?: string
  phone?: string
  website?: string
} & ClubRelations &
  ClubCountRelations

export const mapApiClubToClub = (apiClub: ApiClub): Club => ({
  id: apiClub.id,
  federationId: apiClub.federation_id || undefined,
  responsibleId: apiClub.responsible_id || undefined,
  addressId: apiClub.address_id || undefined,
  name: apiClub.name,
  shortName: apiClub.short_name || undefined,
  email: apiClub.email || undefined,
  phone: apiClub.phone || undefined,
  website: apiClub.website || undefined,

  address: apiClub.address
    ? mapApiAddressToAddress(apiClub.address)
    : undefined,
  sedes: apiClub.sedes?.length
    ? apiClub.sedes.map(mapApiSedeToSede)
    : undefined,
  federation: apiClub.federation
    ? mapApiFederationToFederation(apiClub.federation)
    : undefined,
  responsible: apiClub.responsible
    ? mapApiUserToUser(apiClub.responsible)
    : undefined,
  teams: apiClub.teams
    ? apiClub.teams.map(team => mapApiTeamToTeam(team, false))
    : undefined,
  licenses: apiClub.licenses
    ? apiClub.licenses.map(mapApiLicenseToLicense)
    : undefined,

  sedesCount: apiClub.sedes_count ?? undefined,
  teamsCount: apiClub.teams_count ?? undefined,
  gamesCount: apiClub.games_count ?? undefined,
  licensesCount: apiClub.licenses_count ?? undefined,
})
