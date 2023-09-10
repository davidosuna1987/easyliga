<script lang="ts" setup>
definePageMeta({
  middleware: ['guest'],
})
</script>

<template>
  <NuxtLayout name="mini">
    <div class="easy-auth-page easy-verify-page">
      <FormAuthVerify />
    </div>
  </NuxtLayout>
</template>
