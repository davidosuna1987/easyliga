import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()

export default [
  {
    label: 'profiles.profile',
    to: '/profile',
  },
  {
    separator: true,
  },
  {
    label: 'auth.logout',
    command: () => auth.logout(),
  },
]
