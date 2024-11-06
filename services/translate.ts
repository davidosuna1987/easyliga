import {
  TranslateJsonRequest,
  mapTranslateJsonRequestToApiTranslateJsonRequest,
} from '@/domain/translate'
import { ApiTranslateResponse } from '@/types/api/translate'

const PREFIX = 'translate'

export default class TranslateService {
  json(data: TranslateJsonRequest) {
    return useApi<ApiTranslateResponse>(`${PREFIX}/json`, {
      method: 'POST',
      body: mapTranslateJsonRequestToApiTranslateJsonRequest(data),
    })
  }
}
