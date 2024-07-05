import { ApiFederation } from '@/types/api/federation'
import { Address, mapApiAddressToAddress } from '@/domain/address'
import { User, mapApiUserToUser } from '@/domain/user'
import { Division, mapApiDivisionToDivision } from '@/domain/division'
import { Club, mapApiClubToClub } from '@/domain/club'
import { Sede, mapApiSedeToSede } from '@/domain/sede'
import { League, mapApiLeagueToLeague } from '@/domain/league'
import { License, mapApiLicenseToLicense } from '@/domain/license'

export const FEDERATION_SCOPE_MAPPER = {
  national: 'national',
  regional: 'regional',
  provincial: 'provincial',
  district: 'district',
  local: 'local',
} as const

export type FederationScope =
  (typeof FEDERATION_SCOPE_MAPPER)[keyof typeof FEDERATION_SCOPE_MAPPER]

export type FederationRelations = {
  responsible?: User
  federation?: Federation
  federations?: Federation[]
  divisions?: Division[]
  leagues?: League[]
  clubs?: Club[]
  sedes?: Sede[]
  address?: Address
  licenses?: License[]

  hierarchy?: number // used to list federations in a tree structure
}

export type FederationCountRelations = {
  federationsCount?: number
  divisionsCount?: number
  leaguesCount?: number
  clubsCount?: number
  sedesCount?: number
}

export type Federation = {
  id: number
  name: string
  shortName?: string
  scope?: FederationScope
  email?: string
  phone?: string
  website?: string
  federationId?: number
  responsibleId?: number
  addressId?: number
} & FederationRelations &
  FederationCountRelations

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
  federationId: apiFederation.federation_id ?? undefined,
  responsibleId: apiFederation.responsible_id ?? undefined,
  addressId: apiFederation.address_id ?? undefined,

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
  licenses: apiFederation.licenses
    ? apiFederation.licenses.map(mapApiLicenseToLicense)
    : undefined,

  federationsCount: apiFederation.federations_count ?? undefined,
  divisionsCount: apiFederation.divisions_count ?? undefined,
  leaguesCount: apiFederation.leagues_count ?? undefined,
  clubsCount: apiFederation.clubs_count ?? undefined,
  sedesCount: apiFederation.sedes_count ?? undefined,
})
