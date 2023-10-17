import { ApiGame, ApiGameInitialDataResponse } from '@/types/api/game'
import { Call, mapApiCallToCall } from '@/domain/call'
import { Set, mapApiSetToSet } from '@/domain/set'
import {
  CurrentRotation,
  mapApiCurrentRotationToCurrentRotation,
} from '@/domain/rotation'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { Profile, mapApiProfileToProfile } from '@/domain/profile'
import { Sede, mapApiSedeToSede } from '@/domain/sede'
import { Club } from '@/domain/club'
import { Court } from '@/domain/court'
import { ApiCategory } from '@/types/api/category'
import { ApiGender } from '@/types/api/gender'
import { Division } from '@/domain/division'
import { League } from '@/domain/league'
import moment from 'moment'

export const GAME_OBSERVATIONS_DELAY = 10

export enum CategoryType {
  MASCULINE = 'masculine',
  FEMININE = 'feminine',
  MIXED = 'mixed',
}

export type Category = {
  id: number
  name: CategoryType
}

export enum GenderType {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export type Gender = {
  id: number
  name: GenderType
}

export type GameInitialData = {
  id: number
  game: Game
  calls: Call[]
  localTeamRotation: CurrentRotation
  visitorTeamRotation: CurrentRotation
  league: League
  localTeam: Team
  visitorTeam: Team
  sede: Sede
  court: string
  referee: Profile
}

export type GameRelations = {
  league?: League
  division?: Division
  club?: Club
  sede?: Sede
  court?: Court
  referee?: Profile
  localTeam?: Team
  visitorTeam?: Team
  winnerTeam?: Team
  loserTeam?: Team
  teams?: Team[]
  sets?: Set[]
  calls?: Call[]
  currentSet?: Set
}

export type GameRelationsCount = {
  localTeamSetsWonCount?: number
  visitorTeamSetsWonCount?: number
}

export type GameStatus =
  | 'warmup'
  | 'playing'
  | 'timeout'
  | 'resting'
  | 'finished'

export type Game = {
  id: number
  name: string
  leagueId: number | null
  divisionId: number | null
  clubId: number | null
  sedeId: number | null
  courtId: number | null
  refereeId: number | null
  localTeamId: number | null
  visitorTeamId: number | null
  winnerTeamId: number | null
  loserTeamId: number | null
  date: string | null
  start: string | null
  end: string | null
  status: GameStatus
  comments: string | null
} & GameRelations &
  GameRelationsCount

export const mapApiGameToGame = (apiGame: ApiGame): Game => ({
  id: apiGame.id,
  name: apiGame.name,
  leagueId: apiGame.league_id,
  divisionId: apiGame.division_id,
  clubId: apiGame.club_id,
  sedeId: apiGame.sede_id,
  courtId: apiGame.court_id,
  refereeId: apiGame.referee_id,
  localTeamId: apiGame.local_team_id,
  visitorTeamId: apiGame.visitor_team_id,
  winnerTeamId: apiGame.winner_team_id,
  loserTeamId: apiGame.loser_team_id,
  date: apiGame.date,
  start: apiGame.start,
  end: apiGame.end,
  status: apiGame.status,
  comments: apiGame.comments,
  sets: apiGame.sets?.map(mapApiSetToSet),
  currentSet: apiGame.current_set
    ? mapApiSetToSet(apiGame.current_set)
    : undefined,
  localTeamSetsWonCount: apiGame.local_team_sets_won_count,
  visitorTeamSetsWonCount: apiGame.visitor_team_sets_won_count,
})

export const mapApiGameInitialDataToGame = (
  apiGameInitialData: ApiGameInitialDataResponse,
): GameInitialData => {
  const {
    game,
    calls,
    local_team_rotation,
    visitor_team_rotation,
    league,
    referee,
    local_team,
    visitor_team,
    sede,
    court,
  } = apiGameInitialData.data
  return {
    id: game.id,
    game: mapApiGameToGame(game),
    calls: calls.map(mapApiCallToCall),
    localTeamRotation:
      mapApiCurrentRotationToCurrentRotation(local_team_rotation),
    visitorTeamRotation: mapApiCurrentRotationToCurrentRotation(
      visitor_team_rotation,
    ),
    league: {
      id: league.id,
      name: league.name,
      season: league.season,
    },
    referee: mapApiProfileToProfile(referee),
    localTeam: mapApiTeamToTeam(local_team),
    visitorTeam: mapApiTeamToTeam(visitor_team),
    sede: mapApiSedeToSede(sede),
    court: court.name,
  }
}

export const mapApiCategoryToCategory = (
  apiCategory: ApiCategory,
): Category => ({
  id: apiCategory.id,
  name: apiCategory.name as CategoryType,
})

export const mapApiGenderToGender = (apiGender: ApiGender): Gender => ({
  id: apiGender.id,
  name: apiGender.name as GenderType,
})

export const isValidCoachPanelGame = (game: Game): boolean =>
  !game.end ||
  moment(game.end).add(GAME_OBSERVATIONS_DELAY, 'minutes').valueOf() >
    moment().valueOf()
