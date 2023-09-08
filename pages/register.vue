<script lang="ts" setup>
definePageMeta({
  middleware: ['guest'],
  mainClass: 'no-background',
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-auth-page easy-register-page">
      <Heading class="mb-5" position="center">{{
        $t('auth.register')
      }}</Heading>
      <FormAuthRegister />
    </div>
  </NuxtLayout>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'RegisterPage',
}
</script>
