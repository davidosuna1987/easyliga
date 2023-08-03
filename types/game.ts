import { ApiCategory } from '@/types/api/category'
import { ApiCourt } from '@/types/api/court'
import { ApiGender } from '@/types/api/gender'
import { ApiLeague } from '@/types/api/league'
import { ApiSede } from '@/types/api/sede'
import { ApiTeam } from '@/types/api/team'

export type GameStorePreviewData = {
  category: ApiCategory | null
  gender: ApiGender | null
  league: ApiLeague | null
  localTeam: ApiTeam | null
  visitorTeam: ApiTeam | null
  sede: ApiSede | null
  court: ApiCourt | null
}
