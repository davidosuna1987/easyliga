<script lang="ts" setup>
definePageMeta({
  middleware: ['guest'],
})

useEasyHead('pages.auth.register.title')

const { t } = useI18n()
</script>

<template>
  <NuxtLayout name="mini">
    <div class="easy-auth-page easy-register-page">
      <Heading class="mb-5" position="center">{{ t('auth.register') }}</Heading>
      <FormAuthRegister />
    </div>
  </NuxtLayout>
</template>
