<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'

useEasyHead('pages.index.title')

const auth = useAuthStore()
const { t } = useI18n()

const showPage = computed(() => auth.isLoggedIn && auth.isAdmin())

const redirectIfNotAdmin = () => {
  if (!showPage.value) {
    auth.loginRedirect()
  }
}

onMounted(() => redirectIfNotAdmin())
</script>

<template>
  <NuxtLayout name="default">
    <div v-if="showPage" class="easy-index-page">
      <template v-if="auth.isAdmin()">
        <Heading class="mb-5" tag="h3" position="center">
          {{ t('pages.index.welcome') }}
        </Heading>

        <QuickAside class="mb-10" :title="t('auth.login_as_quick')">
          <FormAdminLoginAs />
        </QuickAside>

        <QuickAside class="mb-10" :title="t('emails.custom_quick')">
          <EmailForm />
        </QuickAside>

        <QuickAside class="mb-10" :title="t('translate.quick')">
          <TranslateJson />
        </QuickAside>
      </template>
    </div>
  </NuxtLayout>
</template>
