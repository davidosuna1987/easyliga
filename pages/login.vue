<script lang="ts" setup></script>

<template>
  <div class="easy-auth-page easy-login-page">
    <h4 class="text-center mb-5">{{ $t('auth.welcome') }}</h4>
    <FormAuthLogin />
  </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'LoginPage',
}
</script>
