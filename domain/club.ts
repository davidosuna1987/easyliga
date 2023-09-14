import { Address, mapApiAddressToAddress } from '@/domain/address'
import { Sede, mapApiSedeToSede } from '@/domain/sede'
import { Federation, Game } from '@/domain/game'
import { Responsible } from '@/domain/profile'
import { Team } from '@/domain/team'
import { ApiClub } from '@/types/api/club'

export type ClubRelations = {
  address?: Address
  sedes?: Sede[]
  federation?: Federation
  responsible?: Responsible
  teams?: Team[]
  games?: Game[]
}

export type Club = {
  id: number
  name: string
  shortName?: string
  email?: string
  phone?: string
  website?: string
} & ClubRelations

export const mapApiClubToClub = (apiClub: ApiClub): Club => ({
  id: apiClub.id,
  name: apiClub.name,
  shortName: apiClub.short_name || undefined,
  email: apiClub.email || undefined,
  phone: apiClub.phone || undefined,
  website: apiClub.website || undefined,
  address: apiClub.address
    ? mapApiAddressToAddress(apiClub.address)
    : undefined,
  sedes: apiClub.sedes?.length
    ? apiClub.sedes.map(mapApiSedeToSede)
    : undefined,
})
