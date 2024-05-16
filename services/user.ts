import { ApiUsersResponse } from '@/types/api/user'

const PREFIX = 'users'

export default class UserService {
  search(params?: Record<string, string>) {
    return useApi<ApiUsersResponse>(`${PREFIX}/search`, {
      params,
    })
  }
}
