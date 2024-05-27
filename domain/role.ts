export const ROLE_MAPPER = {
  admin: 'admin',
  staff: 'staff',
  federation: 'federation',
  club: 'club',
  referee: 'referee',
  coach: 'coach',
  player: 'player',
  user: 'user',
} as const

export const ROLES = Object.values(ROLE_MAPPER)

export type Role = (typeof ROLES)[number]
