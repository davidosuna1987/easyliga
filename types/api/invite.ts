import { ApiUser } from '@/types/api/user'
import { ApiTeam } from '@/types/api/team'
import { Role } from '@/domain/role'
import { InvitedToType } from '@/domain/invite'

export type ApiInviteRelations = {
  invitor: ApiUser | null
  invited_to: ApiTeam | null
}

export type ApiInviteAppends = {
  unavailable_shirt_numbers: number[] | null
  email_role_names: string | null
  role_names: string | null
}

export type ApiInvite = {
  id: number
  invited_by: number
  invited_to_type: string | null
  invited_to_id: number | null
  email: string
  roles: Role[]
  code: string
  type: InvitedToType | null
  used_at: string | null
  created_at: string
  updated_at: string
} & ApiInviteRelations &
  ApiInviteAppends

export type ApiInviteRequest = {
  email: string
  roles: Role[]
  invited_to_type: InvitedToType | null
  invited_to_id: number | null
}

export type ApiAddRolesRequest = {
  roles: Role[]
  shirt_number: number | null
}

export type ApiInviteResponse = {
  success: true
  data: {
    invite: ApiInvite
  }
  errors: null
}
