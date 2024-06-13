import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()

export const authItems = [
  {
    label: 'profiles.profile',
    to: '/profile',
  },
]

export const licensableItems = [
  {
    label: 'licenses.owned',
    to: '/profile/licenses',
  },
]

export const logoutItems = [
  {
    separator: true,
  },
  {
    label: 'auth.logout',
    command: () => auth.logout(),
  },
]
