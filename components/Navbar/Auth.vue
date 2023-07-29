<script setup lang="ts">
const items = useMenuItems()
</script>

<template>
  <NavbarContainer class="easy-navbar-auth" :items="items">
    <template #end>
      <NavbarAvatar />
    </template>
  </NavbarContainer>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'NavbarAuth',
}
</script>
