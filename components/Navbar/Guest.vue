<script setup lang="ts">
import items from '@/domain/navbar/guest'
</script>

<template>
  <Menubar class="easy-navbar easy-navbar-guest" :model="items">
    <template #start>
      <NuxtLink to="/">
        <NuxtImg
          class="easy-navbar__logo"
          src="/logos/easyliga.svg"
          quality="100"
          width="38"
          height="38"
          fit="contain"
        />
      </NuxtLink>
    </template>
    <template #end>
      <NuxtLink to="/register">
        <Button :label="$t('auth.register')" size="small" outlined />
      </NuxtLink>
      <NuxtLink to="/login">
        <Button :label="$t('auth.login')" size="small" class="ml-3" />
      </NuxtLink>
    </template>
  </Menubar>
</template>

<style scoped></style>
