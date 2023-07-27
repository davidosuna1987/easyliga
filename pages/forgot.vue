<script lang="ts" setup></script>

<template>
  <div class="easy-auth-page easy-forgot-page">
    <h4 class="text-center mb-5">{{ $t('auth.forgot') }}</h4>
    <FormAuthForgot />
  </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'ForgotPage',
}
</script>
