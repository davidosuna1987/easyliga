import { useAuthStore } from '@/stores/useAuthStore'

const app = useNuxtApp()
const auth = useAuthStore()

export default [
  {
    label: app.$i18n.t('profiles.profile'),
    to: '/profile',
  },
  {
    separator: true,
  },
  {
    label: app.$i18n.t('auth.logout'),
    command: () => auth.logout(),
  },
]
