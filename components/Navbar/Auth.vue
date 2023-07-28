<script setup lang="ts">
import webItems from '@/config/navbar/web'
</script>

<template>
  <NavbarWeb class="easy-navbar-auth" :items="webItems">
    <template #end>
      <NavbarAvatar />
    </template>
  </NavbarWeb>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'NavbarAuth',
}
</script>
