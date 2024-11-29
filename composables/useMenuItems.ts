import { useAuthStore } from '@/stores/useAuthStore'
import { MenuItem } from 'primevue/menuitem'

import guestItems from '@/config/navbar/items/guest'
import federationItems from '@/config/navbar/items/federation'
import clubItems from '@/config/navbar/items/club'
import refereeItemsConfig from '@/config/navbar/items/referee'
import refereeAdminItems from '@/config/navbar/items/referee-admin'
import refereeAdminRefereeItems from '@/config/navbar/items/referee-admin-referee'
import coachItems from '@/config/navbar/items/coach'
import { ROLE_MAPPER } from '@/domain/role'

export default function useMenuItems() {
  const auth = useAuthStore()
  const items = ref<MenuItem[]>(guestItems)

  const showRefereeMenu = auth.hasAnyRole([
    ROLE_MAPPER.referee,
    ROLE_MAPPER.referee_admin,
  ])
  const isReferee = auth.hasRole(ROLE_MAPPER.referee)
  const isRefereeAdmin = auth.hasRole(ROLE_MAPPER.referee_admin)
  const isRefereeAdminReferee = isReferee && isRefereeAdmin

  const refereeItems: MenuItem[] = isRefereeAdminReferee
    ? refereeAdminRefereeItems
    : isRefereeAdmin
    ? refereeAdminItems
    : refereeItemsConfig

  if (auth.hasRole(ROLE_MAPPER.federation)) {
    items.value = [...items.value, federationItems].flat()
  }

  if (auth.hasRole(ROLE_MAPPER.club)) {
    items.value = [...items.value, clubItems].flat()
  }

  if (showRefereeMenu) {
    items.value = [...items.value, refereeItems].flat()
  }

  if (auth.hasRole(ROLE_MAPPER.coach)) {
    items.value = [...items.value, coachItems].flat()
  }

  return items
}
