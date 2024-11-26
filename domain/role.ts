import { ApiRole } from 'types/api/role'

export const ROLE_MAPPER = {
  admin: 'admin',
  staff: 'staff',
  federation: 'federation',
  club: 'club',
  referee_admin: 'referee_admin',
  referee: 'referee',
  coach: 'coach',
  player: 'player',
  user: 'user',
} as const

export const ROLES = Object.values(ROLE_MAPPER)

export type RoleModel = {
  id: number
  name: Role
  displayName: string | null
  description: string | null
  meta: Record<string, any>
}

export type Role = (typeof ROLES)[number]

export const mapApiRoleToRole = (apiRole: ApiRole): Role => apiRole.name

export const mapApiRoleToRoleModel = (apiRole: ApiRole): RoleModel => ({
  id: apiRole.id,
  name: apiRole.name,
  displayName: apiRole.display_name,
  description: apiRole.description,
  meta: apiRole.pivot.meta,
})
