import { Role } from '@/domain/role'

export type ApiRole = {
  id: number
  name: Role
  display_name: string | null
  description: string | null
  pivot: {
    user_id: number
    role_id: number
  }
  created_at: string | null
  updated_at: string | null
}
