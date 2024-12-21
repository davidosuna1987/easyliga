<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation'],
})

useEasyHead('pages.federation.referees.title')

const { t } = useI18n()
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-federation-referees-page">
      <Heading tag="h3" class="mb-5">{{ t('referees.referee', 2) }}</Heading>
      <FederationRefereeList />
    </div>
  </NuxtLayout>
</template>
