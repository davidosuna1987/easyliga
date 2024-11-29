import { Address } from './address'
import { Call } from './call'
import { Court } from './court'
import { Division, DivisionRelations } from './division'
import { Federation } from './federation'
import {
  Category,
  Game,
  GameCustomAppends,
  GameRelations,
  Gender,
} from './game'
import { Injury } from './injury'
import { Invite } from './invite'
import {
  League,
  LeagueCustomAppends,
  LeagueRelations,
  Matchday,
} from './league'
import { License } from './license'
import { Player } from './player'
import { Point } from './point'
import { Profile } from './profile'
import { RoleModel } from './role'
import { Rotation } from './rotation'
import { Sanction } from './sanction'
import { Sede } from './sede'
import { Set } from './set'
import { Team, TeamAppends } from './team'
import { Timeout } from './timeout'
import { User } from './user'

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object | undefined ? DeepPartial<T[P]> : T[P]
}

export type AddressDeepPartial = DeepPartial<Address>
export type CallDeepPartial = DeepPartial<Call>
export type CategoryDeepPartial = DeepPartial<Category>
export type CourtDeepPartial = DeepPartial<Court>
export type DivisionDeepPartial = DeepPartial<Division>
export type FederationDeepPartial = DeepPartial<Federation>
export type GameDeepPartial = DeepPartial<Game>
export type GenderDeepPartial = DeepPartial<Gender>
export type InjuryDeepPartial = DeepPartial<Injury>
export type InviteDeepPartial = DeepPartial<Invite>
export type LeagueDeepPartial = DeepPartial<League>
export type LicenseDeepPartial = DeepPartial<License>
export type MatchdayDeepPartial = DeepPartial<Matchday>
export type PlayerDeepPartial = DeepPartial<Player>
export type PointDeepPartial = DeepPartial<Point>
export type ProfileDeepPartial = DeepPartial<Profile>
export type RoleModelDeepPartial = DeepPartial<RoleModel>
export type RotationDeepPartial = DeepPartial<Rotation>
export type SanctionDeepPartial = DeepPartial<Sanction>
export type SedeDeepPartial = DeepPartial<Sede>
export type SetDeepPartial = DeepPartial<Set>
export type TeamDeepPartial = DeepPartial<Team>
export type TimeoutDeepPartial = DeepPartial<Timeout>
export type UserDeepPartial = DeepPartial<User>

export type GameRelationsDeepPartial = DeepPartial<GameRelations>
export type LeagueRelationsDeepPartial = DeepPartial<LeagueRelations>
export type DivisionRelationsDeepPartial = DeepPartial<DivisionRelations>

export type TeamAppendsDeepPartial = DeepPartial<TeamAppends>

export type GameCustomAppendsDeepPartial = DeepPartial<GameCustomAppends>
export type LeagueCustomAppendsDeepPartial = DeepPartial<LeagueCustomAppends>
