<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'

definePageMeta({
  middleware: ['role'],
  roles: ['admin'],
})

useEasyHead('pages.index.title')

const auth = useAuthStore()
const { t } = useI18n()
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-admin-index-page">
      <template v-if="auth.isAdmin()">
        <Heading class="mb-5" tag="h3" position="center">
          {{ t('pages.index.welcome') }}
        </Heading>

        <AdminDashboard />
      </template>
    </div>
  </NuxtLayout>
</template>
