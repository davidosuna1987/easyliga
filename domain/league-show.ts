import {
  ApiLeagueShow,
  ApiLeagueShowGame,
  ApiLeagueShowGameReferee,
  ApiLeagueShowGameRefereeProfile,
  ApiLeagueShowTeam,
} from '@/types/api/league-show'
import {
  Game,
  mapApiGameStatisticsToGameStatistics,
  mapApiTeamNamesToTeamNames,
  CategoryType,
  GenderType,
} from '@/domain/game'
import {
  League,
  LeagueClassification,
  mapApiLeagueClassificationTeamToLeagueClassificationTeam,
  MATCHDAY_TYPES,
  MatchdayType,
} from '@/domain/league'
import { Profile, ProfileAppends } from '@/domain/profile'
import { Team } from '@/domain/team'
import { mapApiUserToUser, User } from '@/domain/user'

export type LeagueShowModelIdName = {
  id: number
  name: string
}

export type LeagueShowTeam = {
  id: Team['id']
  name: Team['name']
  divisionId: Team['divisionId']
  categoryId: Team['categoryId']
  genderId: Team['genderId']
  federation: LeagueShowModelIdName
  division: LeagueShowModelIdName
  club: LeagueShowModelIdName
  category: {
    id: number
    name: CategoryType
  }
  gender: {
    id: number
    name: GenderType
  }
}

export type LeagueShowGame = {
  id: Game['id']
  date: Game['date']
  status: Game['status']
  matchday: Game['matchday']
  isBye: Game['isBye']
  statistics: Game['statistics']
  refereeId: Game['refereeId']
  teamNames: Game['teamNames']
  referee: LeagueShowGameReferee | undefined
}

export type LeagueShowGameMatchday = {
  matchday?: number
  games: LeagueShowGame[]
}

export type LeagueShowGameRefereeProfile = {
  firstName: Profile['firstName']
  lastName: Profile['lastName']
  fullName: ProfileAppends['fullName']
}

export type LeagueShowGameReferee = User /* {
  id: Game['refereeId']
  profile: LeagueShowGameRefereeProfile
} */

export type LeagueShow = {
  id: League['id']
  name: League['name']
  federationId: League['federationId']
  divisionId: League['divisionId']
  categoryId: League['categoryId']
  genderId: League['genderId']
  federation: LeagueShowModelIdName
  division: LeagueShowModelIdName
  category: {
    id: number
    name: CategoryType
  }
  gender: {
    name: GenderType
  }
  matchdaysCount: number
  teams: LeagueShowTeam[]
  games?: LeagueShowGame[]
  classification?: LeagueClassification
  matchdays?: LeagueShowGameMatchday[]
}

export const mapApiLeagueShowToLeagueShow = (
  apiLeagueShow: ApiLeagueShow,
): LeagueShow => ({
  id: apiLeagueShow.id,
  name: apiLeagueShow.name,
  federationId: apiLeagueShow.federation_id ?? undefined,
  divisionId: apiLeagueShow.division_id ?? undefined,
  categoryId: apiLeagueShow.category_id ?? undefined,
  genderId: apiLeagueShow.gender_id ?? undefined,
  federation: apiLeagueShow.federation,
  division: apiLeagueShow.division,
  category: apiLeagueShow.category,
  gender: apiLeagueShow.gender,
  matchdaysCount: apiLeagueShow.matchdays_count,
  teams: apiLeagueShow.teams.map(mapApiLeagueShowTeamToLeagueShowTeam),
  games: apiLeagueShow.games
    ? apiLeagueShow.games.map(mapApiLeagueShowGameToLeagueShowGame)
    : undefined,
  classification: apiLeagueShow.classification
    ? apiLeagueShow.classification.map(
        mapApiLeagueClassificationTeamToLeagueClassificationTeam,
      )
    : undefined,
  matchdays: apiLeagueShow.games
    ? mapApiLeagueShowGamesToApiLeagueShowGameMatchdays(apiLeagueShow.games)
    : undefined,
})

export const mapApiLeagueShowTeamToLeagueShowTeam = (
  apiLeagueShowTeam: ApiLeagueShowTeam,
): LeagueShowTeam => ({
  id: apiLeagueShowTeam.id,
  name: apiLeagueShowTeam.name,
  divisionId: apiLeagueShowTeam.division_id ?? undefined,
  categoryId: apiLeagueShowTeam.category_id ?? undefined,
  genderId: apiLeagueShowTeam.gender_id ?? undefined,
  federation: apiLeagueShowTeam.federation,
  division: apiLeagueShowTeam.division,
  club: apiLeagueShowTeam.club,
  category: apiLeagueShowTeam.category,
  gender: apiLeagueShowTeam.gender,
})

export const mapApiLeagueShowGameToLeagueShowGame = (
  apiLeagueShowGame: ApiLeagueShowGame,
): LeagueShowGame => ({
  id: apiLeagueShowGame.id,
  date: apiLeagueShowGame.date ?? undefined,
  status: apiLeagueShowGame.status ?? undefined,
  matchday: apiLeagueShowGame.matchday ?? undefined,
  isBye: apiLeagueShowGame.is_bye,
  statistics: mapApiGameStatisticsToGameStatistics(
    apiLeagueShowGame.statistics,
  ),
  refereeId: apiLeagueShowGame.referee_id ?? undefined,
  teamNames: mapApiTeamNamesToTeamNames(apiLeagueShowGame.team_names),
  referee: mapApiLeagueGameRefereeToLeagueShowGameReferee(
    apiLeagueShowGame.referee,
  ),
})

export const mapApiLeagueShowGamesToApiLeagueShowGameMatchdays = (
  apiLeagueShowGames: ApiLeagueShowGame[],
  matchdayType: MatchdayType = MATCHDAY_TYPES.matchday,
): LeagueShowGameMatchday[] => {
  const matchdays: LeagueShowGameMatchday[] = []

  apiLeagueShowGames.forEach(apiGame => {
    if (matchdayType === MATCHDAY_TYPES.matchday && !apiGame.matchday) return
    if (matchdayType === MATCHDAY_TYPES.empty && apiGame.matchday) return

    const matchdayIndex = matchdays.findIndex(
      matchday => matchday.matchday === apiGame.matchday,
    )

    if (matchdayIndex === -1) {
      matchdays.push({
        matchday: apiGame.matchday ?? undefined,
        games: [mapApiLeagueShowGameToLeagueShowGame(apiGame)],
      })
    } else {
      matchdays[matchdayIndex].games.push(
        mapApiLeagueShowGameToLeagueShowGame(apiGame),
      )
    }
  })
  return matchdays
}

export const mapApiLeagueGameRefereeToLeagueShowGameReferee = (
  apiLeagueShowGameReferee: ApiLeagueShowGameReferee | null,
): LeagueShowGameReferee | undefined =>
  apiLeagueShowGameReferee
    ? mapApiUserToUser(apiLeagueShowGameReferee)
    : undefined
/* apiLeagueShowGameReferee
    ? {
        id: apiLeagueShowGameReferee.id ?? undefined,
        profile: mapApiLeagueGameRefereeProfileToLeagueShowGameRefereeProfile(
          apiLeagueShowGameReferee.profile,
        ),
      }
    : undefined */

export const mapApiLeagueGameRefereeProfileToLeagueShowGameRefereeProfile = (
  apiLeagueShowGameRefereeProfile: ApiLeagueShowGameRefereeProfile,
): LeagueShowGameRefereeProfile => ({
  firstName: apiLeagueShowGameRefereeProfile.first_name,
  lastName: apiLeagueShowGameRefereeProfile.last_name,
  fullName: apiLeagueShowGameRefereeProfile.full_name,
})
