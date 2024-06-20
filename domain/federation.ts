import { ApiFederation } from '@/types/api/federation'
import { Address, mapApiAddressToAddress } from '@/domain/address'
import { User, mapApiUserToUser } from '@/domain/user'
import { Division, mapApiDivisionToDivision } from '@/domain/division'
import { Club, mapApiClubToClub } from '@/domain/club'
import { Sede, mapApiSedeToSede } from '@/domain/sede'
import { League, mapApiLeagueToLeague } from '@/domain/league'

export enum FederationScope {
  NATIONAL = 'national',
  REGIONAL = 'regional',
  PROVINCIAL = 'provincial',
  DISTRICT = 'district',
  LOCAL = 'local',
}

export type FederationRelations = {
  responsible?: User
  federation?: Federation
  federations?: Federation[]
  divisions?: Division[]
  leagues?: League[]
  clubs?: Club[]
  sedes?: Sede[]
  address?: Address
}

export type Federation = {
  id: number
  name: string
  shortName?: string
  scope?: FederationScope
  email?: string
  phone?: string
  website?: string
} & FederationRelations

export const mapApiFederationToFederation = (
  apiFederation: ApiFederation,
): Federation => ({
  id: apiFederation.id,
  name: apiFederation.name,
  shortName: apiFederation.short_name ?? undefined,
  scope: apiFederation.scope ?? undefined,
  email: apiFederation.email ?? undefined,
  phone: apiFederation.phone ?? undefined,
  website: apiFederation.website ?? undefined,
  responsible: apiFederation.responsible
    ? mapApiUserToUser(apiFederation.responsible)
    : undefined,

  federation: apiFederation.federation
    ? mapApiFederationToFederation(apiFederation.federation)
    : undefined,
  federations: apiFederation.federations
    ? apiFederation.federations.map(mapApiFederationToFederation)
    : undefined,
  divisions: apiFederation.divisions
    ? apiFederation.divisions.map(mapApiDivisionToDivision)
    : undefined,
  leagues: apiFederation.leagues
    ? apiFederation.leagues.map(mapApiLeagueToLeague)
    : undefined,
  clubs: apiFederation.clubs
    ? apiFederation.clubs.map(mapApiClubToClub)
    : undefined,
  sedes: apiFederation.sedes
    ? apiFederation.sedes.map(mapApiSedeToSede)
    : undefined,
  address: apiFederation.address
    ? mapApiAddressToAddress(apiFederation.address)
    : undefined,
})
