<script setup lang="ts">
useEasyHead('pages.classification.title')

const { t } = useI18n()
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-web-classification-page">
      <Heading class="mb-5" tag="h3" position="center">
        {{ t('Clasificación') }}
      </Heading>

      <WebClassification />
    </div>
  </NuxtLayout>
</template>
