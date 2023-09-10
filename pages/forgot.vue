<script lang="ts" setup>
definePageMeta({
  middleware: ['guest'],
})
</script>

<template>
  <NuxtLayout name="mini">
    <div class="easy-auth-page easy-forgot-page">
      <Heading class="mb-5" position="center">{{ $t('auth.forgot') }}</Heading>
      <FormAuthForgot />
    </div>
  </NuxtLayout>
</template>
