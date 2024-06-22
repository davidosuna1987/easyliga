import { User, mapApiUserToUser } from '@/domain/user'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { Role } from '@/domain/role'
import { ApiInvite } from '@/types/api/invite'

export const INVITED_TO_TYPE_MAPPER = {
  team: 'team',
  club: 'club',
} as const

export const INVITED_TO_TYPES = Object.values(INVITED_TO_TYPE_MAPPER)

export type InvitedToType = (typeof INVITED_TO_TYPES)[number]

export type InvitedRole = Extract<Role, 'player' | 'coach' | 'club'>

export const ROLE_TO_INVITED_TO_TYPE_MAPPER: Record<
  InvitedRole,
  InvitedToType
> = {
  player: 'team',
  coach: 'team',
  club: 'club',
} as const

export type InviteRelations = {
  invitor: User | undefined
  invitedTo: Team | undefined
}

export type InviteAppends = {
  unavailableShirtNumbers: number[] | undefined
  emailRoleNames: string | undefined
  roleNames: string | undefined
}

export type Invite = {
  id: number
  invitedBy: number
  invitedToType: InvitedToType | undefined
  invitedToId: number | undefined
  email: string
  roles: Role[]
  code: string
  type: InvitedToType | undefined
  usedAt: string | undefined
} & InviteRelations &
  InviteAppends

export type InviteShirtNumberInputRef = {
  isShirtNumberTaken: () => boolean
}

export const mapApiInviteToInvite = (apiInvite: ApiInvite): Invite => ({
  id: apiInvite.id,
  invitedBy: apiInvite.invited_by,
  invitedToType: apiInvite.invited_to_type ?? undefined,
  invitedToId: apiInvite.invited_to_id ?? undefined,
  email: apiInvite.email,
  roles: apiInvite.roles,
  code: apiInvite.code,
  type: apiInvite.type ?? undefined,
  usedAt: apiInvite.used_at ?? undefined,
  emailRoleNames: apiInvite.email_role_names ?? undefined,
  roleNames: apiInvite.role_names ?? undefined,

  invitor: apiInvite.invitor ? mapApiUserToUser(apiInvite.invitor) : undefined,
  invitedTo: apiInvite.invited_to
    ? mapApiTeamToTeam(apiInvite.invited_to)
    : undefined,

  unavailableShirtNumbers: apiInvite.unavailable_shirt_numbers
    ? sortShirtNumbers(apiInvite.unavailable_shirt_numbers)
    : undefined,
})

export const sortShirtNumbers = (
  shirtNumbers: number[],
  desc = false,
): number[] => shirtNumbers.sort((a, b) => (desc ? b - a : a - b))

export const invitedAsRole = (invite: Invite, role: InvitedRole): boolean =>
  invite.roles.includes(role)

export const invitedAsPlayer = (invite: Invite): boolean =>
  invitedAsRole(invite, 'player')

export const invitedAsCoach = (invite: Invite): boolean =>
  invitedAsRole(invite, 'coach')

export const invitedAsClub = (invite: Invite): boolean =>
  invitedAsRole(invite, 'club')

export const invitedToType = (invite: Invite, type: InvitedToType): boolean =>
  invite.type === type

export const invitedToTeam = (invite: Invite): boolean =>
  invitedToType(invite, 'team')

export const invitedToClub = (invite: Invite): boolean =>
  invitedToType(invite, 'club')
