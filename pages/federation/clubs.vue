<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation'],
})

useEasyHead('pages.federation.clubs.title')

const { t } = useI18n()
</script>

<template>
  <NuxtLayout name="default">
    <Heading tag="h3" class="mb-5">{{ t('clubs.club', 2) }}</Heading>
    <div class="easy-federations-clubs-page">
      <FederationClubList />
    </div>
  </NuxtLayout>
</template>
