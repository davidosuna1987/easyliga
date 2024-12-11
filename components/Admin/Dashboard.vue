<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="easy-admin-dashboard-component">
    <QuickAside class="mb-10" :title="t('auth.login_as_quick')">
      <FormAdminLoginAs />
    </QuickAside>

    <QuickAside class="mb-10" :title="t('emails.custom_quick')">
      <EmailForm />
    </QuickAside>

    <QuickAside class="mb-10" :title="t('translate.quick')">
      <TranslateJson />
    </QuickAside>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AdminDashboard',
}
</script>
