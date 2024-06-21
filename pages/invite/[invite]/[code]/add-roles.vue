<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'

const { t } = useI18n()
const route = useRoute()
const easyStorage = useEasyStorage()
const auth = useAuthStore()

onMounted(() => {
  if (!auth.isLoggedIn) {
    easyStorage.set('loginRedirect', route.fullPath)
  }
})
</script>

<template>
  <NuxtLayout name="mini">
    <div class="easy-auth-page easy-invite-add-roles-page">
      <InviteAddRolesForm
        v-if="auth.isLoggedIn"
        :inviteId="Number(route.params.invite as string)"
        :code="(route.params.code as string)"
      />
      <EasyGrid v-else :gap="5">
        <Heading class="mb-5" position="center">
          {{ t('invites.add_roles') }}
        </Heading>
        <p>{{ t('invites.login_to_accept') }}</p>
        <NuxtLink class="flex justify-center" to="/login">
          <Button :label="t('auth.login')" />
        </NuxtLink>
      </EasyGrid>
    </div>
  </NuxtLayout>
</template>
