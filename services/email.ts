import {
  EmailCustomRequest,
  mapEmailCustomRequestToApiEmailCustomRequest,
} from '@/domain/email'
import { ApiMessageResponse } from '@/types/api/auth'

const PREFIX = 'emails'

export default class EmailService {
  custom(data: EmailCustomRequest) {
    return useApi<ApiMessageResponse>(`${PREFIX}/custom`, {
      method: 'POST',
      body: mapEmailCustomRequestToApiEmailCustomRequest(data),
    })
  }
}
