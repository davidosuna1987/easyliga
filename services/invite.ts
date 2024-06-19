import { ApiInviteResponse } from '@/types/api/invite'

export default class InviteService {
  get(inviteId: number, code: string, params?: Record<string, string>) {
    return useApi<ApiInviteResponse>(`invites/${inviteId}/${code}`, { params })
  }
}
