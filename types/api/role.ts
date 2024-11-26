import { Role } from '@/domain/role'

export type ApiUserRolePivot = {
  type: 'API_USER_ROLE_PIVOT'
  user_id: number
  role_id: number
  meta: Record<string, any>
}

export type ApiRole = {
  id: number
  name: Role
  display_name: string | null
  description: string | null
  pivot: ApiUserRolePivot
  created_at: string | null
  updated_at: string | null
}
