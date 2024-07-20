import { Division, mapApiDivisionToDivision } from '@/domain/division'
import {
  Category,
  Game,
  mapApiCategoryToCategory,
  mapApiGameToGame,
} from '@/domain/game'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { ApiCreateMatchdaysGamesRequest, ApiLeague } from '@/types/api/league'
import { ApiGame } from '@/types/api/game'

export type LeagueRelations = {
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
}

export type LeagueCountRelations = {
  teamsCount?: number
  gamesCount?: number
}

export type League = {
  id: number
  categoryId?: number
  divisionId?: number
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
  categoryId: apiLeague.category_id ?? undefined,
  divisionId: apiLeague.division_id ?? undefined,
  genderId: apiLeague.gender_id ?? undefined,
  name: apiLeague.name,
  season: apiLeague.season,
  start: apiLeague.start ?? undefined,
  end: apiLeague.end ?? undefined,

  division: apiLeague.division
    ? mapApiDivisionToDivision(apiLeague.division)
    : undefined,
  category: apiLeague.category
    ? mapApiCategoryToCategory(apiLeague.category)
    : undefined,
  gender: apiLeague.gender ?? undefined,
  teams: apiLeague.teams
    ? apiLeague.teams.map(team => mapApiTeamToTeam(team))
    : undefined,
  games: apiLeague.games ? apiLeague.games.map(mapApiGameToGame) : undefined,

  teamsCount: apiLeague.teams_count,
  gamesCount: apiLeague.games_count,

  matchdays: apiLeague.games
    ? mapApiGamesToMatchdays(apiLeague.games)
    : undefined,
})

export const mapCreateMatchdaysGamesRequestToApiCreateMatchdaysGamesRequest = (
  createMatchdaysGamesRequest: CreateMatchdaysGamesRequest,
): ApiCreateMatchdaysGamesRequest => ({
  start: createMatchdaysGamesRequest.start ?? null,
})
