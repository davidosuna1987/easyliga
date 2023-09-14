import { Game, mapApiGameToGame } from '@/domain/game'
import { Responsible, mapApiProfileToResponsible } from '@/domain/profile'
import { Sede, mapApiSedeToSede } from '@/domain/sede'
import { ApiCourt } from '@/types/api/court'

export type CourtRelations = {
  sede?: Sede
  responsible?: Responsible
  games?: Game[]
}

export type Court = {
  id: number
  name: string
  number: number
} & CourtRelations

export const mapApiCourtToCourt = (apiCourt: ApiCourt): Court => ({
  id: apiCourt.id,
  name: apiCourt.name,
  number: apiCourt.number,
  sede: apiCourt.sede ? mapApiSedeToSede(apiCourt.sede) : undefined,
  responsible: apiCourt.responsible
    ? mapApiProfileToResponsible(apiCourt.responsible)
    : undefined,
  games: apiCourt.games ? apiCourt.games.map(mapApiGameToGame) : undefined,
})
