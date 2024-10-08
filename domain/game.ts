import {
  ApiGame,
  ApiGameRequestChangeDateRequest,
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
import { Club, mapApiClubToClub } from '@/domain/club'
import { Court, mapApiCourtToCourt } from '@/domain/court'
import { ApiCategory } from '@/types/api/category'
import { ApiGender } from '@/types/api/gender'
import { Division, mapApiDivisionToDivision } from '@/domain/division'
import { League, mapApiLeagueToLeague } from '@/domain/league'
import { Sanction, mapApiSanctionToSanction } from '@/domain/sanction'
import { User, mapApiUserToUser } from '@/domain/user'
import { Timeout } from '@/domain/timeout'
import {
  GameSignature,
  mapApiGameSignatureToGameSignature,
} from '@/domain/game-signature'
import moment from 'moment'
import { Duration, mapApiDurationToDuration } from '@/domain/utils'
import { IconName } from '@/domain/icon'

export const SETS_TO_WIN = 3
export const GAME_OBSERVATIONS_DELAY = 10

export const CATEGORY_MAPPER = {
  masculine: 'masculine',
  femenine: 'femenine',
  mixed: 'mixed',
} as const

export type CategoryType = keyof typeof CATEGORY_MAPPER

export type Category = {
  id: number
  name: CategoryType
}

export const GameReportSideTeamTypes = {
  LEFT: 'A',
  RIGHT: 'B',
} as const

export const GameReportTeamTypes = {
  A: 'A',
  B: 'B',
} as const

export type GameStatus =
  | 'warmup'
  | 'playing'
  | 'timeout'
  | 'resting'
  | 'finished'

export const GENDER_TYPES = {
  masculine: 'masculine',
  femenine: 'femenine',
  mixed: 'mixed',
} as const

export type GenderType = keyof typeof GENDER_TYPES

export type GenderIconName =
  | Extract<IconName, 'masculine' | 'femenine'>
  | 'mixed'

export type Gender = {
  id: number
  name: GenderType
}

export type GameRefereeAssignFormRef = {
  handleSubmit: () => void
  loadingApi: boolean
  selectedReferee: User | undefined
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

export type GameCustomAppends = {
  name: string
  duration?: Duration
  confirmed: boolean
}

export type Game = {
  id: number
  leagueId?: number
  divisionId?: number
  clubId?: number
  sedeId?: number
  courtId?: number
  refereeId?: number
  localTeamId?: number
  visitorTeamId?: number
  winnerTeamId?: number
  loserTeamId?: number
  date?: string
  dateConfirmedBy: number[]
  requestedDate?: string
  dateRequestedBy?: number
  matchday?: number
  start?: string
  end?: string
  status?: GameStatus
  observations?: string
} & GameRelations &
  GameRelationsCount &
  GameCustomAppends

export type GameObservationsRequest = {
  observations?: string
}

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
  calls: Call[]
}

export type GameSidedTeams = {
  leftSideTeam: Team
  rightSideTeam: Team
}

export type GameLocalVisitorCalls = {
  localTeamCall: Call
  visitorTeamCall: Call
}

export type GameLocalVisitorTimeouts = {
  localTeamTimeouts: Timeout[]
  visitorTeamTimeouts: Timeout[]
}

export type GameStorePreviewData = {
  category: Category | undefined
  gender: Gender | undefined
  league: League | undefined
  localTeam: Team | undefined
  visitorTeam: Team | undefined
  sede: Sede | undefined
  court: Court | undefined
}

export type GameRequestChangeDateRequest = {
  requestedDate: Date
}

export const mapApiGameToGame = (apiGame: ApiGame): Game => ({
  id: apiGame.id,
  leagueId: apiGame.league_id ?? undefined,
  divisionId: apiGame.division_id ?? undefined,
  clubId: apiGame.club_id ?? undefined,
  sedeId: apiGame.sede_id ?? undefined,
  courtId: apiGame.court_id ?? undefined,
  refereeId: apiGame.referee_id ?? undefined,
  localTeamId: apiGame.local_team_id ?? undefined,
  visitorTeamId: apiGame.visitor_team_id ?? undefined,
  winnerTeamId: apiGame.winner_team_id ?? undefined,
  loserTeamId: apiGame.loser_team_id ?? undefined,
  date: apiGame.date ?? undefined,
  dateConfirmedBy: apiGame.date_confirmed_by,
  requestedDate: apiGame.requested_date ?? undefined,
  dateRequestedBy: apiGame.date_requested_by ?? undefined,
  matchday: apiGame.matchday ?? undefined,
  start: apiGame.start ?? undefined,
  end: apiGame.end ?? undefined,
  status: apiGame.status ?? undefined,
  observations: apiGame.observations ?? undefined,

  ...mapApiGameRelationsToGameRelations(apiGame),
  ...mapApiGameRelationsCountToGameRelationsCount(apiGame),
  ...mapApiGameCustomAppendsToGameCustomAppends(apiGame),
})

export const mapApiGameRelationsToGameRelations = (
  apiGame: ApiGame,
): GameRelations => ({
  league: apiGame.league ? mapApiLeagueToLeague(apiGame.league) : undefined,
  division: apiGame.division
    ? mapApiDivisionToDivision(apiGame.division)
    : undefined,
  club: apiGame.club ? mapApiClubToClub(apiGame.club) : undefined,
  sede: apiGame.sede ? mapApiSedeToSede(apiGame.sede) : undefined,
  court: apiGame.court ? mapApiCourtToCourt(apiGame.court) : undefined,
  referee: apiGame.referee ? mapApiUserToUser(apiGame.referee) : undefined,
  localTeam: apiGame.local_team
    ? mapApiTeamToTeam(apiGame.local_team)
    : undefined,
  visitorTeam: apiGame.visitor_team
    ? mapApiTeamToTeam(apiGame.visitor_team)
    : undefined,
  winnerTeam: apiGame.winner_team
    ? mapApiTeamToTeam(apiGame.winner_team)
    : undefined,
  loserTeam: apiGame.loser_team
    ? mapApiTeamToTeam(apiGame.loser_team)
    : undefined,
  teams: apiGame.teams?.map(team => mapApiTeamToTeam(team, false)),
  calls: apiGame.calls?.map(mapApiCallToCall),
  sets: apiGame.sets?.map(mapApiSetToSet),
  currentSet: apiGame.current_set
    ? mapApiSetToSet(apiGame.current_set)
    : undefined,
  sanctions: apiGame.sanctions
    ? apiGame.sanctions.map(mapApiSanctionToSanction)
    : undefined,
  signatures: apiGame.signatures
    ? apiGame.signatures.map(mapApiGameSignatureToGameSignature)
    : undefined,
})

export const mapApiGameRelationsCountToGameRelationsCount = (
  apiGame: ApiGame,
): GameRelationsCount => ({
  localTeamSetsWonCount: apiGame.local_team_sets_won_count ?? undefined,
  visitorTeamSetsWonCount: apiGame.visitor_team_sets_won_count ?? undefined,
})

export const mapApiGameCustomAppendsToGameCustomAppends = (
  apiGame: ApiGame,
): GameCustomAppends => ({
  name: apiGame.name,
  duration: mapApiDurationToDuration(apiGame.duration),
  confirmed: apiGame.confirmed,
})

export const mapApiGameInitialDataToGameInitialData = (
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
    league: mapApiLeagueToLeague(league),
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
  name: apiGender.name,
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
  calls: apiGameReportSimple.calls.map(mapApiCallToCall),
})

export const isMatchDay = (game: Game): boolean =>
  !!game.date && moment(game.date).isSame(moment(), 'day')

export const isMatchDayPassed = (game: Game): boolean =>
  moment(game.date).isBefore(moment(), 'day')

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

export const getLocalVisitorCalls = (
  calls: Call[],
  localTeam: Team,
  visitorTeam: Team,
): GameLocalVisitorCalls | undefined => {
  const localTeamCall = calls.find(call => call.teamId === localTeam.id)
  const visitorTeamCall = calls.find(call => call.teamId === visitorTeam.id)

  if (!localTeamCall || !visitorTeamCall) return undefined

  return { localTeamCall, visitorTeamCall }
}

export const getLocalVisitorTimeouts = (
  timeouts: Timeout[],
  localTeam: Team,
  visitorTeam: Team,
): GameLocalVisitorTimeouts => {
  const localTeamTimeouts = timeouts.filter(
    timeout => timeout.teamId === localTeam.id,
  )
  const visitorTeamTimeouts = timeouts.filter(
    timeout => timeout.teamId === visitorTeam.id,
  )

  return { localTeamTimeouts, visitorTeamTimeouts }
}

export const mapGameRequestChangeDateRequestToApiGameRequestChangeDateRequest =
  (request: GameRequestChangeDateRequest): ApiGameRequestChangeDateRequest => {
    return {
      requested_date: moment(request.requestedDate).format(
        'YYYY-MM-DD HH:mm:ss',
      ),
    }
  }

export const hasDefaultReferee = (game: Game): boolean =>
  !game.refereeId || game.refereeId === 1

export const isSameCoachForBothTeams = (game: Game): boolean => {
  if (!game.localTeam || !game.visitorTeam) return false
  return game.localTeam.coachId === game.visitorTeam.coachId
}
