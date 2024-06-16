<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { ApiProfile } from '@/types/api/profile'
import { mapApiProfileToProfile } from '@/domain/profile'

definePageMeta({
  middleware: ['auth'],
})

const auth = useAuthStore()

const handleUpdated = (data: ApiProfile) => auth.refreshProfile(data)
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
