<script setup lang="ts">
import items from '@/config/navbar/auth'

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
