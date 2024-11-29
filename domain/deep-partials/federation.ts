import { FederationDeepPartial } from 'domain/deep-partial'
import { FederationCountRelations } from 'domain/federation'
import { ApiFederationDeepPartial } from 'types/api/deep-partial'

export const mapApiFederationToFederationDeepPartial = (
  apiFederation: ApiFederationDeepPartial,
): FederationDeepPartial => ({
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

  ...mapApiFederationRelationsToFederationRelationsDeepPartial(apiFederation),
  ...mapApiFederationRelationsCountToFederationCountRelationsDeepPartial(
    apiFederation,
  ),
})

export const mapApiFederationRelationsToFederationRelationsDeepPartial = (
  apiFederation: ApiFederationDeepPartial,
): FederationDeepPartial => ({
  responsible: apiFederation.responsible
    ? mapApiUserToUser(apiFederation.responsible)
    : undefined,
  federation: apiFederation.federation
    ? mapApiFederationToFederationDeepPartial(apiFederation.federation)
    : undefined,
  federations: apiFederation.federations
    ? apiFederation.federations.map(mapApiFederationToFederationDeepPartial)
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
    ? mapApiAddressToAddressDeepPartial(apiFederation.address)
    : undefined,
  licenses: apiFederation.licenses
    ? apiFederation.licenses.map(mapApiLicenseToLicense)
    : undefined,
  referees: apiFederation.referees
    ? apiFederation.referees.map(mapApiUserToUser)
    : undefined,
  adminReferees: apiFederation.admin_referees
    ? apiFederation.admin_referees.map(mapApiUserToUser)
    : undefined,
  regularReferees: apiFederation.regular_referees
    ? apiFederation.regular_referees.map(mapApiUserToUser)
    : undefined,
})

export const mapApiFederationRelationsCountToFederationCountRelationsDeepPartial =
  (apiFederation: ApiFederationDeepPartial): FederationCountRelations => ({
    federationsCount: apiFederation.federations_count ?? undefined,
    divisionsCount: apiFederation.divisions_count ?? undefined,
    leaguesCount: apiFederation.leagues_count ?? undefined,
    clubsCount: apiFederation.clubs_count ?? undefined,
    sedesCount: apiFederation.sedes_count ?? undefined,
  })
