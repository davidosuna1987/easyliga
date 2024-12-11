<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'

useEasyHead('pages.index.title')

const { t } = useI18n()
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-index-page">
      <Heading class="mb-5" tag="h3" position="center">
        {{ t('pages.index.welcome') }}
      </Heading>
    </div>
  </NuxtLayout>
</template>
