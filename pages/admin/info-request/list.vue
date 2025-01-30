<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import InfoRequestService from '@/services/info-request'

definePageMeta({
  middleware: ['role'],
  roles: ['admin'],
})

useEasyHead('Admin')

const auth = useAuthStore()
const { t } = useI18n()

const infoRequestService = new InfoRequestService()
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

        <InfoRequestTable />
      </template>
    </div>
  </NuxtLayout>
</template>
