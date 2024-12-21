<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['federation'],
})

useEasyHead('pages.federation.index.title')

const { t } = useI18n()
</script>

<template>
  <NuxtLayout name="default">
    <div class="easy-federations-page">
      <Heading tag="h3" class="mb-5">{{
        t('federations.federation', 2)
      }}</Heading>
      <FederationList />
    </div>
  </NuxtLayout>
</template>
