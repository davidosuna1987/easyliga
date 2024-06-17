<script setup lang="ts">
const { t } = useI18n()
const config = useRuntimeConfig()
</script>

<template>
  <footer class="easy-footer flex items-center justify-center">
    <NuxtImg
      class="easy-navbar__logo"
      src="/logos/easyliga.svg"
      quality="100"
      width="25"
      height="25"
      fit="contain"
    />

    <small>{{ config.public.appName }} — {{ t('footer.copyright') }}</small>
  </footer>
</template>

<script lang="ts">
export default {
  name: 'Footer',
}
</script>
