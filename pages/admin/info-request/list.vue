<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'

definePageMeta({
  middleware: ['role'],
  roles: ['admin'],
})

useEasyHead('Admin')

const auth = useAuthStore()
const { t } = useI18n()
</script>

<template>
  <NuxtLayout name="admin">
    <template #sidebar>
      <AdminSidebar />
    </template>

    <div class="easy-admin-index-page">
      <template v-if="auth.isAdmin()">
        <Heading class="mb-5" tag="h3" position="center">
          {{ t('info_requests.info_request', 2) }}
        </Heading>
      </template>
    </div>
  </NuxtLayout>
</template>
