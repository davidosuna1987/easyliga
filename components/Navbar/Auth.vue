<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import items from '@/config/navbar/auth'

const auth = useAuthStore()
const authMenu = ref()
</script>

<template>
  <NavbarWeb class="easy-navbar-auth">
    <template #end>
      <Avatar
        class="easy-navbar__avatar"
        image="https://i.pravatar.cc/300"
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
  </NavbarWeb>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'NavbarAuth',
}
</script>
config/navbar/auth
