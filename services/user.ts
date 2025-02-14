import { ApiUsersResponse } from '@/types/api/user'
import { ApiInviteRequest } from '@/types/api/invite'
import { ApiMessageResponse } from '@/types/api/auth'
import { Role } from '@/domain/role'

const PREFIX = 'users'

export default class UserService {
  search(params?: Record<string, string>) {
    return useApi<ApiUsersResponse>(`${PREFIX}/search`, {
      params,
    })
  }

  invite(data: ApiInviteRequest) {
    return useApi<ApiMessageResponse>(`${PREFIX}/invite`, {
      method: 'POST',
      body: data,
    })
  }

  toggleRole(id: number, role: Role) {
    return useApi<ApiMessageResponse>(`${PREFIX}/${id}/roles/toggle/${role}`, {
      method: 'PUT',
    })
  }
}
