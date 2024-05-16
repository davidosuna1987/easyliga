import {
  ApiGameSignatureResponse,
  ApiGameSignatureStoreRequest,
} from '@/types/api/game-signature'

const PREFIX = 'game-signatures'

export default class GameSignatureService {
  store(gameId: number, data: ApiGameSignatureStoreRequest) {
    return useApi<ApiGameSignatureResponse>(`${PREFIX}/games/${gameId}`, {
      method: 'POST',
      body: data,
    })
  }
}
