<script lang="ts" setup></script>

<template>
  <div class="easy-auth-page easy-reset-page">
    <Heading class="mb-5" position="center">{{ $t('auth.reset') }}</Heading>
    <FormAuthReset />
  </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'ResetPage',
}
</script>
