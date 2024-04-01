import {
  ApiGame,
  ApiGameInitialDataResponse,
  ApiGameObservationsRequest,
  ApiGameReportSimple,
} from '@/types/api/game'
import { Call, mapApiCallToCall } from '@/domain/call'
import { Set, SetSide, mapApiSetToSet } from '@/domain/set'
import {
  CurrentRotation,
  mapApiCurrentRotationToCurrentRotation,
} from '@/domain/rotation'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { Profile, mapApiProfileToProfile } from '@/domain/profile'
import { Sede, mapApiSedeToSede } from '@/domain/sede'
import { Club } from '@/domain/club'
import { Court, mapApiCourtToCourt } from '@/domain/court'
import { ApiCategory } from '@/types/api/category'
import { ApiGender } from '@/types/api/gender'
import { Division, mapApiDivisionToDivision } from '@/domain/division'
import { League, mapApiLeagueToLeague } from '@/domain/league'
import { Sanction, mapApiSanctionToSanction } from '@/domain/sanction'
import { User, mapApiUserToUser } from '@/domain/user'
import {
  GameSignature,
  mapApiGameSignatureToGameSignature,
} from '@/domain/game-signature'
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
  localTeamSetsWonCount: number
  visitorTeamSetsWonCount: number
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
  referee?: User
  localTeam?: Team
  visitorTeam?: Team
  winnerTeam?: Team
  loserTeam?: Team
  teams?: Team[]
  sets?: Set[]
  calls?: Call[]
  currentSet?: Set
  sanctions?: Sanction[]
  signatures?: GameSignature[]
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
  observations: string | null
} & GameRelations &
  GameRelationsCount

export type GameObservationsRequest = {
  observations?: string
}

export const GameReportTeamTypes = {
  A: 'A',
  B: 'B',
} as const

export type GameReportTeamType =
  (typeof GameReportTeamTypes)[keyof typeof GameReportTeamTypes]

export type GameReportSimple = {
  game: Game
  division: Division
  category: Category
  gender: Gender
  localTeam: Team
  visitorTeam: Team
  referee: Profile
  sede: Sede
  court: Court
  sets: Set[]
}

export type GameSidedTeams = {
  leftSideTeam: Team
  rightSideTeam: Team
}

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
  observations: apiGame.observations,

  sets: apiGame.sets?.map(mapApiSetToSet),
  currentSet: apiGame.current_set
    ? mapApiSetToSet(apiGame.current_set)
    : undefined,
  sanctions: apiGame.sanctions
    ? apiGame.sanctions.map(mapApiSanctionToSanction)
    : undefined,

  localTeamSetsWonCount: apiGame.local_team_sets_won_count,
  visitorTeamSetsWonCount: apiGame.visitor_team_sets_won_count,
  referee: apiGame.referee ? mapApiUserToUser(apiGame.referee) : undefined,
  signatures: apiGame.signatures
    ? apiGame.signatures.map(mapApiGameSignatureToGameSignature)
    : undefined,
})

export const mapApiGameInitialDataToGame = (
  apiGameInitialData: ApiGameInitialDataResponse,
): GameInitialData => {
  const {
    game,
    calls,
    local_team_rotation,
    visitor_team_rotation,
    local_team_sets_won_count,
    visitor_team_sets_won_count,
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
    localTeamSetsWonCount: local_team_sets_won_count ?? 0,
    visitorTeamSetsWonCount: visitor_team_sets_won_count ?? 0,
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

export const mapGameObservationsRequestToApiGameObservationsRequest = (
  gameObservationsRequest: GameObservationsRequest,
): ApiGameObservationsRequest => {
  return {
    observations: gameObservationsRequest.observations ?? null,
  }
}

export const mapApiGameReportSimpleToGameReportSimple = (
  apiGameReportSimple: ApiGameReportSimple,
): GameReportSimple => ({
  game: mapApiGameToGame(apiGameReportSimple.game),
  division: mapApiDivisionToDivision(apiGameReportSimple.division),
  category: mapApiCategoryToCategory(apiGameReportSimple.category),
  gender: mapApiGenderToGender(apiGameReportSimple.gender),
  localTeam: mapApiTeamToTeam(apiGameReportSimple.local_team),
  visitorTeam: mapApiTeamToTeam(apiGameReportSimple.visitor_team),
  referee: mapApiProfileToProfile(apiGameReportSimple.referee),
  sede: mapApiSedeToSede(apiGameReportSimple.sede),
  court: mapApiCourtToCourt(apiGameReportSimple.court),
  sets: apiGameReportSimple.sets.map(mapApiSetToSet),
})

export const isValidCoachPanelGame = (game: Game): boolean =>
  !game.end ||
  moment(game.end).add(GAME_OBSERVATIONS_DELAY, 'minutes').valueOf() >
    moment().valueOf()

export const getSidedTeams = (
  set: Set,
  localTeam: Team,
  visitorTeam: Team,
): GameSidedTeams | undefined => {
  const leftSideTeam =
    set.localTeamSide === SetSide.LEFT ? localTeam : visitorTeam
  const rightSideTeam =
    leftSideTeam.id === localTeam.id ? visitorTeam : localTeam

  return { leftSideTeam, rightSideTeam }
}
