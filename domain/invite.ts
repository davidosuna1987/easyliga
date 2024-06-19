import { User, mapApiUserToUser } from '@/domain/user'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { Role } from '@/domain/role'
import { ApiInvite } from '@/types/api/invite'

export const INVITED_TO_TYPE_MAPPER = {
  team: 'team',
} as const

export const INVITED_TO_TYPES = Object.values(INVITED_TO_TYPE_MAPPER)

export type InvitedToType = (typeof INVITED_TO_TYPES)[number]

export type InvitedRole = Extract<Role, 'player' | 'coach'>

export const ROLE_TO_INVITED_TO_TYPE_MAPPER: Record<
  InvitedRole,
  InvitedToType
> = {
  player: 'team',
  coach: 'team',
} as const

export type InviteRelations = {
  invitor: User | undefined
  invitedTo: Team | undefined
}

export type InviteAppends = {
  unavailableShirtNumbers: number[] | undefined
}

export type Invite = {
  id: number
  invitedBy: number
  invitedToType: InvitedToType | undefined
  invitedToId: number | undefined
  email: string
  roles: string
  code: string
} & InviteRelations &
  InviteAppends

export const mapApiInviteToInvite = (apiInvite: ApiInvite): Invite => ({
  id: apiInvite.id,
  invitedBy: apiInvite.invited_by,
  invitedToType: apiInvite.invited_to_type ?? undefined,
  invitedToId: apiInvite.invited_to_id ?? undefined,
  email: apiInvite.email,
  roles: apiInvite.roles,
  code: apiInvite.code,

  invitor: apiInvite.invitor ? mapApiUserToUser(apiInvite.invitor) : undefined,
  invitedTo: apiInvite.invited_to
    ? mapApiTeamToTeam(apiInvite.invited_to)
    : undefined,

  unavailableShirtNumbers: apiInvite.unavailable_shirt_numbers ?? undefined,
})
