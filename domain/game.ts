import { ApiGame, ApiGameInitialDataResponse } from '@/types/api/game'
import { mapApiPlayersToPlayers } from '@/domain/player'
import { Call, mapApiCallToCall } from '@/domain/call'
import { Set, mapApiSetToSet } from '@/domain/set'
import { Address } from '@/domain/address'
import {
  CurrentRotation,
  mapApiCurrentRotationToCurrentRotation,
} from '@/domain/rotation'
import { Team } from '@/domain/team'
import { Profile } from '@/domain/profile'

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

export type GameRelationsCount = {
  localTeamSetsWonCount?: number
  visitorTeamSetsWonCount?: number
  // points?: Point[] TODO: add points
}

export type GameStatus = 'warmup' | 'playing' | 'resting' | 'finished'

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
    referee: {
      id: referee.id,
      userId: referee.user_id,
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
