import { useAuthStore } from '@/stores/useAuthStore'
import { MenuItem } from 'primevue/menuitem'

import guestItems from '@/config/navbar/items/guest'
import federationItems from '@/config/navbar/items/federation'
import clubItems from '@/config/navbar/items/club'
import refereeItems from '@/config/navbar/items/referee'
import coachItems from '@/config/navbar/items/coach'

export default function useMenuItems() {
  const auth = useAuthStore()
  const items = ref<MenuItem[]>(guestItems)

  if (auth.hasRole('federation')) {
    items.value = [...items.value, federationItems].flat()
  }

  if (auth.hasRole('club')) {
    items.value = [...items.value, clubItems].flat()
  }

  if (auth.hasRole('referee')) {
    items.value = [...items.value, refereeItems].flat()
  }

  if (auth.hasRole('coach')) {
    items.value = [...items.value, coachItems].flat()
  }

  return items
}
