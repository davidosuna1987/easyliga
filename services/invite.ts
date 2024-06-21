import { ApiAddRolesRequest, ApiInviteResponse } from '@/types/api/invite'

const PREFIX = 'invites'

export default class InviteService {
  get(inviteId: number, code: string, params?: Record<string, string>) {
    return useApi<ApiInviteResponse>(`${PREFIX}/${inviteId}/${code}`, {
      params,
    })
  }

  addRoles(inviteId: number, code: string, data: ApiAddRolesRequest) {
    return useApi<ApiInviteResponse>(`${PREFIX}/${inviteId}/${code}`, {
      method: 'PUT',
      body: data,
    })
  }
}
