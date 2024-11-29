import { DeepPartial } from 'domain/deep-partial'
import { ApiAddress } from './address'
import { ApiCall } from './call'
import { ApiCourt } from './court'
import { ApiDivision } from './division'
import { ApiFederation } from './federation'
import { ApiGame } from './game'
import { ApiInjury } from './injury'
import { ApiInvite } from './invite'
import { ApiLeague } from './league'
import { ApiLicense } from './license'
import { ApiPlayer } from './player'
import { ApiPoint } from './point'
import { ApiProfile } from './profile'
import { ApiRole as ApiRoleModel } from './role'
import { ApiRotation } from './rotation'
import { ApiSanction } from './sanction'
import { ApiSede } from './sede'
import { ApiSet } from './set'
import { ApiTeam } from './team'
import { ApiTimeout } from './timeout'
import { ApiUser } from './user'
import { ApiCategory } from './category'
import { ApiGender } from './gender'

export type ApiAddressDeepPartial = DeepPartial<ApiAddress>
export type ApiCallDeepPartial = DeepPartial<ApiCall>
export type ApiCategoryDeepPartial = DeepPartial<ApiCategory>
export type ApiCourtDeepPartial = DeepPartial<ApiCourt>
export type ApiDivisionDeepPartial = DeepPartial<ApiDivision>
export type ApiFederationDeepPartial = DeepPartial<ApiFederation>
export type ApiGameDeepPartial = DeepPartial<ApiGame>
export type ApiGenderDeepPartial = DeepPartial<ApiGender>
export type ApiInjuryDeepPartial = DeepPartial<ApiInjury>
export type ApiInviteDeepPartial = DeepPartial<ApiInvite>
export type ApiLeagueDeepPartial = DeepPartial<ApiLeague>
export type ApiLicenseDeepPartial = DeepPartial<ApiLicense>
export type ApiPlayerDeepPartial = DeepPartial<ApiPlayer>
export type ApiPointDeepPartial = DeepPartial<ApiPoint>
export type ApiProfileDeepPartial = DeepPartial<ApiProfile>
export type ApiRoleModelDeepPartial = DeepPartial<ApiRoleModel>
export type ApiRotationDeepPartial = DeepPartial<ApiRotation>
export type ApiSanctionDeepPartial = DeepPartial<ApiSanction>
export type ApiSedeDeepPartial = DeepPartial<ApiSede>
export type ApiSetDeepPartial = DeepPartial<ApiSet>
export type ApiTeamDeepPartial = DeepPartial<ApiTeam>
export type ApiTimeoutDeepPartial = DeepPartial<ApiTimeout>
export type ApiUserDeepPartial = DeepPartial<ApiUser>
