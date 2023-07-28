<script lang="ts" setup></script>

<template>
  <div class="easy-auth-page easy-login-page">
    <Heading class="mb-5" position="center">{{ $t('auth.welcome') }}</Heading>
    <FormAuthLogin />
  </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'LoginPage',
}
</script>
