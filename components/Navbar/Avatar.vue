<script setup lang="ts">
import authItems from '@/config/navbar/auth'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
const authMenu = ref()
</script>

<template>
  <Avatar
    class="easy-navbar__avatar"
    :image="auth?.profile?.avatar ?? undefined"
    shape="circle"
    size="normal"
    @click="authMenu.toggle($event)"
  />
  <TieredMenu ref="authMenu" :model="authItems" popup>
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
