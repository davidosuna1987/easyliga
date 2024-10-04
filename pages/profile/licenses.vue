<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { ApiFreshData } from '@/types/api/auth'
import { LICENSABLE_ROLES, LicensableRole } from '@/domain/licensable'
import { mapApiLicenseToLicense } from '@/domain/license'

definePageMeta({
  middleware: ['auth'],
  roles: LICENSABLE_ROLES,
})

useEasyHead('pages.profile.licenses.title')

const { t } = useI18n()
const auth = useAuthStore()

const handleUpdated = (data: ApiFreshData) => auth.refreshData(data)
</script>

<template>
  <NuxtLayout name="mini">
    <div class="easy-profile-licenses-page">
      <Heading class="mb-5" position="center">
        {{ t('licenses.license', 2) }}
      </Heading>
      <UserLicenses
        v-if="auth.roles.some(role => LICENSABLE_ROLES.includes(role as LicensableRole))"
        :licenses="auth.licenses.map(mapApiLicenseToLicense)"
        @updated="handleUpdated"
      />
      <p v-else>{{ t('licensables.unlicensable') }}</p>
    </div>
  </NuxtLayout>
</template>
