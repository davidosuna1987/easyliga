import { Game, mapApiGameToGame } from '@/domain/game'
import { Sede, mapApiSedeToSede } from '@/domain/sede'
import { ApiCourt } from '@/types/api/court'
import { User, mapApiUserToUser } from '@/domain/user'

export type CourtRelations = {
  sede?: Sede
  responsible?: User
  games?: Game[]
}

export type Court = {
  id: number
  name: string
  number: number
  sedeId: number
} & CourtRelations

export const mapApiCourtToCourt = (apiCourt: ApiCourt): Court => ({
  id: apiCourt.id,
  name: apiCourt.name,
  number: apiCourt.number,
  sedeId: apiCourt.sede_id,

  sede: apiCourt.sede ? mapApiSedeToSede(apiCourt.sede) : undefined,
  responsible: apiCourt.responsible
    ? mapApiUserToUser(apiCourt.responsible)
    : undefined,
  games: apiCourt.games ? apiCourt.games.map(mapApiGameToGame) : undefined,
})
