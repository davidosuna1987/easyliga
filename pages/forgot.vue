<script lang="ts" setup>
definePageMeta({
  middleware: ['guest'],
  mainClass: 'no-background',
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-auth-page easy-forgot-page">
      <Heading class="mb-5" position="center">{{ $t('auth.forgot') }}</Heading>
      <FormAuthForgot />
    </div>
  </NuxtLayout>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'ForgotPage',
}
</script>
