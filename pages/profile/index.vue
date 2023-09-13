<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { ApiFreshData } from '@/types/api/auth'

definePageMeta({
  middleware: ['auth'],
})

const auth = useAuthStore()

const handleUpdated = (data: ApiFreshData) => auth.refreshData(data)
</script>

<template>
  <NuxtLayout name="mini">
    <div class="easy-profile-page">
      <ProfileForm
        v-if="auth.profile"
        :profile="auth.profile"
        @updated="handleUpdated"
      />
    </div>
  </NuxtLayout>
</template>
