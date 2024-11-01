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
        <aside class="mb-10">
          <Heading class="mb-5" tag="h3" position="center">
            {{ t('pages.index.welcome') }}
          </Heading>
          <Heading
            class="mb-5 pb-2 [border-bottom:solid_1px_var(--text-color)]"
            tag="h6"
          >
            {{ t('auth.login_as_quick') }}
          </Heading>
          <FormAdminLoginAs class="my-3" />
        </aside>

        <aside class="mb-10">
          <Heading
            class="mb-5 pb-2 [border-bottom:solid_1px_var(--text-color)]"
            tag="h6"
          >
            {{ t('emails.custom_quick') }}
          </Heading>
          <EmailForm class="my-3" />
        </aside>
      </template>
    </div>
  </NuxtLayout>
</template>
