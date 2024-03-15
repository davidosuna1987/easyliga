import { Game, mapApiGameToGame } from '@/domain/game'
import { Responsible, mapApiProfileToResponsible } from '@/domain/profile'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { Federation, mapApiFederationToFederation } from '@/domain/federation'
import { ApiDivision } from '@/types/api/division'

export type DivisionRelations = {
  federation?: Federation
  responsible?: Responsible
  teams?: Team[]
  games?: Game[]
}

export type Division = {
  id: number
  name: string
  priority: number
} & DivisionRelations

export const mapApiDivisionToDivision = (
  apiDivision: ApiDivision,
): Division => ({
  id: apiDivision.id,
  name: apiDivision.name,
  priority: apiDivision.priority,
  federation: apiDivision.federation
    ? mapApiFederationToFederation(apiDivision.federation)
    : undefined,
  responsible: apiDivision.responsible
    ? mapApiProfileToResponsible(apiDivision.responsible)
    : undefined,
  teams: apiDivision.teams
    ? apiDivision.teams.map(team => mapApiTeamToTeam(team))
    : undefined,
  games: apiDivision.games
    ? apiDivision.games.map(mapApiGameToGame)
    : undefined,
})
