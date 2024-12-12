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
    <div v-if="showPage" class="easy-web-landing-page">
      <template v-if="auth.isAdmin()">
        <Heading class="mb-5" tag="h3" position="center">
          {{ t('pages.index.welcome') }}
        </Heading>
      </template>
    </div>
  </NuxtLayout>
</template>
