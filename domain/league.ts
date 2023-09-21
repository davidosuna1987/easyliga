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
  name: string
  season: number
  division?: Division
  category?: Category
  gender?: Gender
  start?: string
  end?: string
}

export const mapApiLeagueToLeague = (apiLeague: any): League => ({
  id: apiLeague.id,
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
