<script lang="ts" setup></script>

<template>
  <NuxtLayout name="default">
    <div class="easy-auth-page easy-login-page">
      <Heading class="mb-5" position="center">{{ $t('auth.welcome') }}</Heading>
      <FormAuthLogin />
    </div>
  </NuxtLayout>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'LoginPage',
}
</script>
