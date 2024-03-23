import {
  ApiGameSignatureResponse,
  ApiGameSignatureStoreRequest,
} from '@/types/api/game-signature'

const GAME_SIGNATURES_API_PREFIX = 'game-signatures'

export default class GameSignatureService {
  store(gameId: number, data: ApiGameSignatureStoreRequest) {
    return useApi<ApiGameSignatureResponse>(
      `${GAME_SIGNATURES_API_PREFIX}/games/${gameId}`,
      {
        method: 'POST',
        body: data,
      },
    )
  }
}
