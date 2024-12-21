<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation'],
})

useEasyHead('pages.federation.leagues.title')

const { t } = useI18n()
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-leagues-page">
      <Heading tag="h3" class="mb-5">{{ t('leagues.league', 2) }}</Heading>
      <LeagueList />
    </div>
  </NuxtLayout>
</template>
