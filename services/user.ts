import { ApiUsersResponse } from '@/types/api/user'
import { ApiInviteRequest } from '@/types/api/invite'
import { ApiMessageResponse } from '@/types/api/auth'

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
}
