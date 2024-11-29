import { DivisionDeepPartial } from 'domain/deep-partial'
import { ApiDivisionDeepPartial } from 'types/api/deep-partial'
import { mapApiFederationToFederationDeepPartial } from './federation'
import { mapApiGameToGameDeepPartial } from './game'

export const mapApiDivisionToDivisionDeepPartial = (
  apiDivision: ApiDivisionDeepPartial,
): DivisionDeepPartial => ({
  id: apiDivision.id ?? undefined,
  name: apiDivision.name ?? undefined,
  priority: apiDivision.priority ?? undefined,
  federation: apiDivision.federation
    ? mapApiFederationToFederationDeepPartial(apiDivision.federation)
    : undefined,
  responsible: apiDivision.responsible
    ? mapApiUserToUserDeepPartia(apiDivision.responsible)
    : undefined,
  teams: apiDivision.teams
    ? apiDivision.teams.map(team => mapApiTeamToTeamDeepPartial(team))
    : undefined,
  games: apiDivision.games
    ? apiDivision.games.map(mapApiGameToGameDeepPartial)
    : undefined,
})
