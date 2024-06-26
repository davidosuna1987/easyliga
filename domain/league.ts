import { Division, mapApiDivisionToDivision } from '@/domain/division'
import {
  Category,
  Gender,
  mapApiCategoryToCategory,
  mapApiGenderToGender,
} from '@/domain/game'

export type LeagueRelations = {
  division?: Division
  category?: Category
  gender?: Gender
}

export type League = {
  id: number
  categoryId: number
  divisionId: number
  genderId: number
  name: string
  season: number
  start?: string
  end?: string
} & LeagueRelations

export const mapApiLeagueToLeague = (apiLeague: any): League => ({
  id: apiLeague.id,
  categoryId: apiLeague.category_id,
  divisionId: apiLeague.division_id,
  genderId: apiLeague.gender_id,
  name: apiLeague.name,
  season: apiLeague.season,
  division: apiLeague.division
    ? mapApiDivisionToDivision(apiLeague.division)
    : undefined,
  category: apiLeague.category
    ? mapApiCategoryToCategory(apiLeague.category)
    : undefined,
  gender: apiLeague.gender ? mapApiGenderToGender(apiLeague.gender) : undefined,
  start: apiLeague.start,
  end: apiLeague.end,
})
