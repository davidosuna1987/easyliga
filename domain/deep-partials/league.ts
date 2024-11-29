import {
  LeagueCustomAppendsDeepPartial,
  LeagueDeepPartial,
  LeagueRelationsDeepPartial,
  MatchdayDeepPartial,
} from 'domain/deep-partial'
import {
  LeagueCountRelations,
  MATCHDAY_TYPES,
  MatchdayType,
} from 'domain/league'
import {
  ApiGameDeepPartial,
  ApiLeagueDeepPartial,
} from 'types/api/deep-partial'
import { mapApiGameToGameDeepPartial } from './game'
import { mapApiFederationToFederationDeepPartial } from './federation'
import { mapApiDivisionToDivisionDeepPartial } from './division'

export const mapApiGamesToMatchdaysDeepPartial = (
  apiGames?: ApiGameDeepPartial[],
  matchdayType: MatchdayType = MATCHDAY_TYPES.matchday,
): MatchdayDeepPartial[] => {
  if (!apiGames) return []

  const matchdays: MatchdayDeepPartial[] = []

  apiGames.forEach(apiGame => {
    if (matchdayType === MATCHDAY_TYPES.matchday && !apiGame.matchday) return
    if (matchdayType === MATCHDAY_TYPES.empty && apiGame.matchday) return

    const matchdayIndex = matchdays.findIndex(
      matchday => matchday.matchday === apiGame.matchday,
    )

    if (matchdayIndex === -1) {
      matchdays.push({
        matchday: apiGame.matchday ?? undefined,
        games: [mapApiGameToGameDeepPartial(apiGame)],
      })
    } else {
      matchdays[matchdayIndex].games?.push(mapApiGameToGameDeepPartial(apiGame))
    }
  })
  return matchdays
}

export const mapApiLeagueToLeagueDeepPartial = (
  apiLeague: ApiLeagueDeepPartial,
): LeagueDeepPartial => ({
  id: apiLeague.id ?? undefined,
  federationId: apiLeague.federation_id ?? undefined,
  divisionId: apiLeague.division_id ?? undefined,
  categoryId: apiLeague.category_id ?? undefined,
  genderId: apiLeague.gender_id ?? undefined,
  name: apiLeague.name ?? undefined,
  season: apiLeague.season ?? undefined,
  start: apiLeague.start ?? undefined,
  end: apiLeague.end ?? undefined,

  ...mapApiLeagueRelationsToLeagueRelationsDeepPartial(apiLeague),
  ...mapApiLeagueCountRelationsToLeagueCountRelationsDeepPartial(apiLeague),
  ...mapApiLeagueCustomAppendsToLeagueCustomAppendsDeepPartial(apiLeague),
})

export const mapApiLeagueRelationsToLeagueRelationsDeepPartial = (
  apiLeague: ApiLeagueDeepPartial,
): LeagueRelationsDeepPartial => ({
  federation: apiLeague.federation
    ? mapApiFederationToFederationDeepPartial(apiLeague.federation)
    : undefined,
  division: apiLeague.division
    ? mapApiDivisionToDivisionDeepPartial(apiLeague.division)
    : undefined,
  category: apiLeague.category
    ? mapApiCategoryToCategoryDeepPartial(apiLeague.category)
    : undefined,
  gender: apiLeague.gender
    ? mapApiGenderToGenderDeepPartial(apiLeague.gender)
    : undefined,
  teams: apiLeague.teams
    ? apiLeague.teams.map(team => mapApiTeamToTeamDeepPartial(team))
    : undefined,
  games: apiLeague.games ? apiLeague.games.map(mapApiGameToGame) : undefined,
})

export const mapApiLeagueCountRelationsToLeagueCountRelationsDeepPartial = (
  apiLeague: ApiLeagueDeepPartial,
): LeagueCountRelations => ({
  teamsCount: apiLeague.teams_count,
  gamesCount: apiLeague.games_count,
})

export const mapApiLeagueCustomAppendsToLeagueCustomAppendsDeepPartial = (
  apiLeague: ApiLeagueDeepPartial,
): LeagueCustomAppendsDeepPartial => ({
  matchdays: apiLeague.games
    ? mapApiGamesToMatchdaysDeepPartial(apiLeague?.games)
    : undefined,
  fullName: apiLeague.full_name,
  nameLong: apiLeague.name_long,
})
