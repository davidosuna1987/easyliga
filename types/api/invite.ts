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
  invited_to_type: InvitedToType | null
  invited_to_id: number | null
  email: string
  roles: string
  code: string
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
}

export type ApiInviteResponse = {
  success: boolean
  data: {
    invite: ApiInvite
  }
  errors: null
}
