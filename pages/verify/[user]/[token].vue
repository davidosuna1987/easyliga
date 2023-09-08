<script lang="ts" setup>
definePageMeta({
  middleware: ['guest'],
  mainClass: 'no-background',
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-auth-page easy-verify-page">
      <FormAuthVerify />
    </div>
  </NuxtLayout>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'VerifyPage',
}
</script>
