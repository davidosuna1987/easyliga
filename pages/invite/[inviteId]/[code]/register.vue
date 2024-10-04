<script lang="ts" setup>
definePageMeta({
  middleware: ['guest'],
})

useEasyHead('pages.invite.register.title')

const { t } = useI18n()
const route = useRoute()
</script>

<template>
  <NuxtLayout name="mini">
    <div class="easy-auth-page easy-invite-register-page">
      <Heading class="mb-5" position="center">
        {{ t('auth.register_by_invite') }}
      </Heading>
      <FormAuthRegister
        :inviteId="Number(route.params.inviteId as string)"
        :code="(route.params.code as string)"
      />
    </div>
  </NuxtLayout>
</template>
