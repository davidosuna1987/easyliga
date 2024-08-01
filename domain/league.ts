import { Division, mapApiDivisionToDivision } from '@/domain/division'
import {
  Category,
  Game,
  mapApiCategoryToCategory,
  mapApiGameToGame,
  mapApiGenderToGender,
} from '@/domain/game'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import {
  ApiCreateMatchdaysGamesRequest,
  ApiLeague,
  ApiLeagueFormRequest,
} from '@/types/api/league'
import { ApiGame } from '@/types/api/game'
import { Federation, mapApiFederationToFederation } from '@/domain/federation'

export type LeagueRelations = {
  federation?: Federation
  division?: Division
  category?: Category
  gender?: {
    id: number
    name: 'masculine' | 'femenine' | 'mixed'
  }
  teams?: Team[]
  games?: Game[]
}

export type Matchday = {
  matchday?: number
  games: Game[]
}

export type LeagueCustomAppends = {
  matchdays?: Matchday[]
  fullName?: string
  nameLong: string
}

export type LeagueCountRelations = {
  teamsCount?: number
  gamesCount?: number
}

export type League = {
  id: number
  federationId?: number
  divisionId?: number
  categoryId?: number
  genderId?: number
  name: string
  season: number
  start?: string
  end?: string
} & LeagueRelations &
  LeagueCountRelations &
  LeagueCustomAppends

export type CreateMatchdaysGamesRequest = {
  start?: Date
}

export const mapApiGamesToMatchdays = (apiGames: ApiGame[]): Matchday[] => {
  const matchdays: Matchday[] = []
  apiGames.forEach(apiGame => {
    const matchdayIndex = matchdays.findIndex(
      matchday => matchday.matchday === apiGame.matchday,
    )
    if (matchdayIndex === -1) {
      matchdays.push({
        matchday: apiGame.matchday ?? undefined,
        games: [mapApiGameToGame(apiGame)],
      })
    } else {
      matchdays[matchdayIndex].games.push(mapApiGameToGame(apiGame))
    }
  })
  return matchdays
}

export const mapApiLeagueToLeague = (apiLeague: ApiLeague): League => ({
  id: apiLeague.id,
  federationId: apiLeague.federation_id ?? undefined,
  divisionId: apiLeague.division_id ?? undefined,
  categoryId: apiLeague.category_id ?? undefined,
  genderId: apiLeague.gender_id ?? undefined,
  name: apiLeague.name,
  season: apiLeague.season,
  start: apiLeague.start ?? undefined,
  end: apiLeague.end ?? undefined,

  ...mapApiLeagueRelationsToLeagueRelations(apiLeague),
  ...mapApiLeagueCountRelationsToLeagueCountRelations(apiLeague),
  ...mapApiLeagueCustomAppendsToLeagueCustomAppends(apiLeague),
})

export const mapApiLeagueRelationsToLeagueRelations = (
  apiLeague: ApiLeague,
): LeagueRelations => ({
  federation: apiLeague.federation
    ? mapApiFederationToFederation(apiLeague.federation)
    : undefined,
  division: apiLeague.division
    ? mapApiDivisionToDivision(apiLeague.division)
    : undefined,
  category: apiLeague.category
    ? mapApiCategoryToCategory(apiLeague.category)
    : undefined,
  gender: apiLeague.gender ? mapApiGenderToGender(apiLeague.gender) : undefined,
  teams: apiLeague.teams
    ? apiLeague.teams.map(team => mapApiTeamToTeam(team))
    : undefined,
  games: apiLeague.games ? apiLeague.games.map(mapApiGameToGame) : undefined,
})

export const mapApiLeagueCountRelationsToLeagueCountRelations = (
  apiLeague: ApiLeague,
): LeagueCountRelations => ({
  teamsCount: apiLeague.teams_count,
  gamesCount: apiLeague.games_count,
})

export const mapApiLeagueCustomAppendsToLeagueCustomAppends = (
  apiLeague: ApiLeague,
): LeagueCustomAppends => ({
  matchdays: apiLeague.games
    ? mapApiGamesToMatchdays(apiLeague.games)
    : undefined,
  fullName: apiLeague.full_name,
  nameLong: apiLeague.name_long,
})

export const mapCreateMatchdaysGamesRequestToApiCreateMatchdaysGamesRequest = (
  createMatchdaysGamesRequest: CreateMatchdaysGamesRequest,
): ApiCreateMatchdaysGamesRequest => ({
  start: createMatchdaysGamesRequest.start ?? null,
})

export const mapLeagueToApiLeagueFormRequest = (
  league?: League,
  federationId?: number,
): ApiLeagueFormRequest => ({
  id: league?.id ?? 0,
  name: league?.name ?? '',
  season: league?.season ?? new Date().getFullYear(),
  federation_id: league?.federationId ?? federationId ?? null,
  division_id: league?.divisionId ?? null,
  category_id: league?.categoryId ?? null,
  gender_id: league?.genderId ?? null,
})
