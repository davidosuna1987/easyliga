export type ApiTeam = {
  id: number
  club_id: number | null
  sede_id: number | null
  division_id: number | null
  category_id: number | null
  gender_id: number | null
  coach_id: number | null
  name: string
  slug: string
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export type ApiTeamResponse = {
  success: boolean
  data: {
    teams: ApiTeam[]
  }
  errors: null
}
