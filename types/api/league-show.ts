import { ApiGame } from '@/types/api/game'
import { ApiLeague } from '@/types/api/league'
import { ApiProfile, ApiProfileAppends } from '@/types/api/profile'
import { ApiTeam } from '@/types/api/team'
import { LeagueShowModelIdName } from '@/domain/league-show'
import { CategoryType, GenderType } from '@/domain/game'
import { ApiUser } from '@/types/api/user'

export type ApiLeagueShowTeam = {
  id: ApiTeam['id']
  name: ApiTeam['name']
  division_id: ApiTeam['division_id']
  category_id: ApiTeam['category_id']
  gender_id: ApiTeam['gender_id']
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

export type ApiLeagueShowGame = {
  id: ApiGame['id']
  date: ApiGame['date']
  status: ApiGame['status']
  matchday: ApiGame['matchday']
  is_bye: ApiGame['is_bye']
  statistics: ApiGame['statistics']
  referee_id: ApiGame['referee_id']
  team_names: ApiGame['team_names']
  referee: ApiLeagueShowGameReferee | null
}

export type ApiLeagueShowGameRefereeProfile = {
  first_name: ApiProfile['first_name']
  last_name: ApiProfile['last_name']
  full_name: ApiProfileAppends['full_name']
}

export type ApiLeagueShowGameReferee = ApiUser /* {
  id: ApiGame['referee_id']
  profile: ApiLeagueShowGameRefereeProfile
} */

export type ApiLeagueShow = {
  id: ApiLeague['id']
  name: ApiLeague['name']
  federation_id: ApiLeague['federation_id']
  division_id: ApiLeague['division_id']
  category_id: ApiLeague['category_id']
  gender_id: ApiLeague['gender_id']
  federation: LeagueShowModelIdName
  division: LeagueShowModelIdName
  category: {
    id: number
    name: CategoryType
  }
  gender: {
    id: number
    name: GenderType
  }
  matchdays_count: number
  teams: ApiLeagueShowTeam[]
  games?: ApiLeagueShowGame[]
}

export type ApiLeagueShowResponse = {
  success: true
  data: {
    league: ApiLeagueShow
  }
  errors: null
}

export type ApiLeagueShowMatchdayGamesResponse = {
  success: true
  data: {
    games: ApiLeagueShowGame[]
  }
  errors: null
}

export type ApiLeagueShowGameResponse = {
  success: true
  data: {
    game: ApiLeagueShowGame
  }
  errors: null
}
