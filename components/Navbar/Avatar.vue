<script setup lang="ts">
import { authItems, licensableItems, logoutItems } from '@/config/navbar/auth'
import { useAuthStore } from '@/stores/useAuthStore'
import { getInitials } from '@/domain/utils'
import { AVATAR_STYLES } from '@/domain/profile'
import { LICENSABLE_ROLES } from '@/domain/licensable'

const auth = useAuthStore()

const authMenu = ref()

const items = computed(() =>
  auth.hasAnyRole(LICENSABLE_ROLES)
    ? [...authItems, ...licensableItems, ...logoutItems]
    : [...authItems, ...logoutItems],
)
</script>

<template>
  <Avatar
    :label="
      auth.profile?.avatar
        ? undefined
        : getInitials(
            auth.profile ? [auth.profile.firstName, auth.profile.lastName] : [],
          )
    "
    :style="AVATAR_STYLES"
    class="easy-navbar__avatar"
    :image="auth.profile?.avatar"
    shape="circle"
    size="normal"
    @click="authMenu.toggle($event)"
  />
  <TieredMenu ref="authMenu" :model="items" popup>
    <template #item="props">
      <NavbarItem :item="props.item" />
    </template>
  </TieredMenu>
</template>

<script lang="ts">
export default {
  name: 'NavbarAvatar',
}
</script>
