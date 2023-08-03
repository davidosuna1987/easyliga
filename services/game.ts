import {
  ApiGameResponse,
  ApiGamesResponse,
  ApiGameStoreRequest,
} from '@/types/api/game'

export default class GameService {
  fetch(params?: Record<string, string>) {
    return useApi<ApiGamesResponse>(`games/fetch`, { params })
  }

  get(gameId: number, params?: Record<string, string>) {
    return useApi<ApiGameResponse>(`games/${gameId}`, { params })
  }

  store(data: ApiGameStoreRequest) {
    return useApi<ApiGameResponse>(`games`, {
      method: 'POST',
      body: data,
    })
  }
}
