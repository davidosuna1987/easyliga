<script setup lang="ts">
const { t } = useI18n()
// onMounted(() => navigateTo('/login'))
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-index-page">
      <Heading class="mb-5" tag="h3" position="center">
        {{ t('pages.index.welcome') }}
      </Heading>
      <FormAdminLoginAs class="my-3" />
    </div>
  </NuxtLayout>
</template>
