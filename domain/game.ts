import { ApiGame, ApiGameInitialDataResponse } from '@/types/api/game'
import { mapApiPlayersToPlayers } from '@/domain/players'
import { Call, mapApiCallToCall } from '@/domain/call'
import { Set, mapApiSetToSet } from '@/domain/set'
import { Team } from '@/domain/team'

export type Address = {
  line1: string
  line2?: string
  city: string
  state: string
  country: string
  postalCode: string
}

export type Responsible = {
  id: number
  firstName: string
  lastName?: string
  email: string
  phone?: string
  avatar?: string
}

export type Category = {
  id: number
  name: string
}

export type Gender = {
  id: number
  name: string
}

export enum FederationScope {
  NATIONAL = 'national',
  REGIONAL = 'regional',
  PROVINCIAL = 'provincial',
  DISTRICT = 'district',
  LOCAL = 'local',
}

export type Federation = {
  id: number
  name: string
  shortName: string
  slug: string
  scope: FederationScope
  email?: string
  phone?: string
  website?: string
  responsible?: Responsible
  address?: Address
  federation?: Federation
}

export type Division = {
  id: number
  name: string
  priority: number
  federation?: Federation
}

export type League = {
  id: number
  name: string
  season: number
  division?: Division
  category?: Category
  gender?: Gender
  start?: string
  end?: string
}

export type Club = {
  id: number
  name: string
  shortName?: string
  slug: string
  federation?: Federation
  responsible?: Responsible
  address?: Address
  email?: string
  phone?: string
  website?: string
}

export type Sede = {
  id: number
  name: string
  shortName?: string
  slug: string
  club?: Club
  responsible?: Responsible
  address?: Address
  email?: string
  phone?: string
  website?: string
}

export type User = {
  id: number
  email: string
}

export type ProfileRelations = {
  user?: User
  address?: Address
}

export type Profile = {
  id: number
  primary?: boolean
  firstName: string
  lastName?: string
  birthday?: string
  gender?: string
  avatar?: string
  email?: string
  phone?: string
} & ProfileRelations

export type GameInitialData = {
  id: number
  game: Game
  calls: Call[]
  league: League
  localTeam: Team
  visitorTeam: Team
  sede: Sede
  court: string
  referee: Profile
}

export type Court = {
  id: number
  name: string
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
  // points?: Point[] TODO: add points
}

export type GameStatus = 'warmup' | 'playing' | 'finished'

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
} & GameRelations

export const mapApiGameToGame = (apiGame: ApiGame): Game => {
  const {
    id,
    name,
    league_id,
    division_id,
    club_id,
    sede_id,
    court_id,
    referee_id,
    local_team_id,
    visitor_team_id,
    winner_team_id,
    loser_team_id,
    date,
    start,
    end,
    status,
    comments,
    sets,
    current_set,
  } = apiGame
  return {
    id,
    name,
    leagueId: league_id,
    divisionId: division_id,
    clubId: club_id,
    sedeId: sede_id,
    courtId: court_id,
    refereeId: referee_id,
    localTeamId: local_team_id,
    visitorTeamId: visitor_team_id,
    winnerTeamId: winner_team_id,
    loserTeamId: loser_team_id,
    date,
    start,
    end,
    status,
    comments,
    sets: sets?.map(mapApiSetToSet),
    currentSet: current_set ? mapApiSetToSet(current_set) : undefined,
  }
}

export const mapApiGameInitialDataToGame = (
  apiGameInitialData: ApiGameInitialDataResponse,
): GameInitialData => {
  const {
    game,
    calls,
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
    league: {
      id: league.id,
      name: league.name,
      season: league.season,
    },
    referee: {
      id: referee.id,
      firstName: referee.first_name,
      lastName: referee.last_name ?? undefined,
      avatar: referee.avatar ?? undefined,
    },
    localTeam: {
      id: local_team.id,
      name: local_team.name,
      players: mapApiPlayersToPlayers(local_team.players),
    },
    visitorTeam: {
      id: visitor_team.id,
      name: visitor_team.name,
      players: mapApiPlayersToPlayers(visitor_team.players),
    },
    sede: {
      id: sede.id,
      name: sede.name,
      shortName: sede.short_name ?? undefined,
      slug: sede.slug,
    },
    court: court.name,
  }
}
