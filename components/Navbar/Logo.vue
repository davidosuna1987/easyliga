<script setup lang="ts">
const logoPath = useEasyLogo()
</script>

<template>
  <NuxtLink class="easy-navbar-logo-component" to="/">
    <NuxtImg
      class="easy-navbar__logo"
      :src="logoPath"
      quality="100"
      fit="contain"
      :style="{ height: '38px' }"
    />
  </NuxtLink>
</template>

<script lang="ts">
export default {
  name: 'NavbarLogo',
}
</script>
