import { useAuthStore } from '@/stores/useAuthStore'
import { MenuItem } from 'primevue/menuitem'

import guestItems from '@/config/navbar/items/guest'
import refereeItems from '@/config/navbar/items/referee'
import coachItems from '@/config/navbar/items/coach'

export default function useEasyToast() {
  const auth = useAuthStore()
  const items = ref<MenuItem[]>(guestItems)

  if (auth.hasRole('referee')) {
    items.value = refereeItems
  }

  if (auth.hasRole('coach')) {
    items.value = coachItems
  }

  return items
}
