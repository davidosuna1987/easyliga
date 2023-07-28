<script lang="ts" setup></script>

<template>
  <div class="easy-auth-page easy-register-page">
    <Heading class="mb-5" position="center">{{ $t('auth.register') }}</Heading>
    <FormAuthRegister />
  </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'RegisterPage',
}
</script>
