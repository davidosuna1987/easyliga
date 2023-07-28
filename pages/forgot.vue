<script lang="ts" setup></script>

<template>
  <div class="easy-auth-page easy-forgot-page">
    <Heading class="mb-5" position="center">{{ $t('auth.forgot') }}</Heading>
    <FormAuthForgot />
  </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'ForgotPage',
}
</script>
