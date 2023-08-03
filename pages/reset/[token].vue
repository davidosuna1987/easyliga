<script lang="ts" setup></script>

<template>
  <NuxtLayout name="default">
    <div class="easy-auth-page easy-reset-page">
      <Heading class="mb-5" position="center">{{ $t('auth.reset') }}</Heading>
      <FormAuthReset />
    </div>
  </NuxtLayout>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'ResetPage',
}
</script>
