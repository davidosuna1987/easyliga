<script setup lang="ts">
import items from '@/domain/navbar/web'
</script>

<template>
  <NavbarWeb class="easy-navbar-guest" :items="items">
    <template #end>
      <NuxtLink to="/register">
        <Button :label="$t('auth.register')" size="small" outlined />
      </NuxtLink>
      <NuxtLink to="/login">
        <Button :label="$t('auth.login')" size="small" class="ml-3" />
      </NuxtLink>
    </template>
  </NavbarWeb>
</template>

<style scoped></style>
