<script setup lang="ts">
const { t } = useI18n()
const items = useMenuItems()
</script>

<template>
  <NavbarContainer class="easy-navbar-guest" :items="items">
    <template #end>
      <NuxtLink to="/register">
        <Button :label="t('auth.register')" size="small" outlined />
      </NuxtLink>
      <NuxtLink to="/login">
        <Button :label="t('auth.login')" size="small" class="ml-3" />
      </NuxtLink>
    </template>
  </NavbarContainer>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'NavbarGuest',
}
</script>
