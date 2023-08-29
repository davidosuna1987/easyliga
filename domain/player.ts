export type Player = {
  profileId: number
  firstName: string
  lastName?: string | null
  shirtNumber: number
  avatar?: string | null
  captain: boolean
  libero: boolean
}
