import { useAuthStore } from '@/stores/useAuthStore'
import { MenuItem } from 'primevue/menuitem'

import guestItems from '@/config/navbar/items/guest'
import clubItems from '@/config/navbar/items/club'
import refereeItems from '@/config/navbar/items/referee'
import coachItems from '@/config/navbar/items/coach'

export default function useMenuItems() {
  const auth = useAuthStore()
  const items = ref<MenuItem[]>(guestItems)

  if (auth.hasRole('club')) {
    items.value = clubItems
  }

  if (auth.hasRole('referee')) {
    items.value = refereeItems
  }

  if (auth.hasRole('coach')) {
    items.value = coachItems
  }

  return items
}
