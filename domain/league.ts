import { Division, mapApiDivisionToDivision } from '@/domain/division'
import { Category, mapApiCategoryToCategory } from '@/domain/game'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { ApiLeague } from '@/types/api/league'

export type LeagueRelations = {
  division?: Division
  category?: Category
  gender?: {
    id: number
    name: 'masculine' | 'femenine' | 'mixed'
  }
  teams?: Team[]
}

export type LeagueCountRelations = {
  teamsCount?: number
}

export type League = {
  id: number
  categoryId?: number
  divisionId?: number
  genderId?: number
  name: string
  season: number
  start?: string
  end?: string
} & LeagueRelations &
  LeagueCountRelations

export const mapApiLeagueToLeague = (apiLeague: ApiLeague): League => ({
  id: apiLeague.id,
  categoryId: apiLeague.category_id ?? undefined,
  divisionId: apiLeague.division_id ?? undefined,
  genderId: apiLeague.gender_id ?? undefined,
  name: apiLeague.name,
  season: apiLeague.season,
  start: apiLeague.start ?? undefined,
  end: apiLeague.end ?? undefined,

  division: apiLeague.division
    ? mapApiDivisionToDivision(apiLeague.division)
    : undefined,
  category: apiLeague.category
    ? mapApiCategoryToCategory(apiLeague.category)
    : undefined,
  gender: apiLeague.gender ?? undefined,
  teams: apiLeague.teams
    ? apiLeague.teams.map(team => mapApiTeamToTeam(team))
    : undefined,

  teamsCount: apiLeague.teams_count,
})
