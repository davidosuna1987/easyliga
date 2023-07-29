import { useAuthStore } from '@/stores/useAuthStore'
import { MenuItem } from 'primevue/menuitem'

import guestItems from '@/config/navbar/items/guest'
import refereeItems from '@/config/navbar/items/referee'

export default function useEasyToast() {
  const auth = useAuthStore()
  const items = ref<MenuItem[]>(guestItems)

  if (auth.hasRole('referee')) {
    items.value = refereeItems
  }

  return items
}
