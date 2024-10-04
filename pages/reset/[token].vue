<script setup lang="ts">
useEasyHead('pages.auth.reset.title')

const { t } = useI18n()
</script>

<template>
  <NuxtLayout name="mini">
    <div class="easy-auth-page easy-reset-page">
      <Heading class="mb-5" position="center">{{ t('auth.reset') }}</Heading>
      <FormAuthReset />
    </div>
  </NuxtLayout>
</template>
