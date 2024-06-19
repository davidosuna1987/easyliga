<script lang="ts" setup>
definePageMeta({
  middleware: ['guest'],
})

const { t } = useI18n()
const route = useRoute()
</script>

<template>
  <NuxtLayout name="mini">
    <div class="easy-auth-page easy-register-page">
      <Heading class="mb-5" position="center">
        {{ t('auth.register_by_invite') }}
      </Heading>
      <FormAuthRegister
        :inviteId="Number(route.params.invite as String)"
        :code="(route.params.code as string)"
      />
    </div>
  </NuxtLayout>
</template>
