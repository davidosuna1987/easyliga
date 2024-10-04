<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  roles: ['coach'],
})

useEasyHead('pages.coach.game.team.call.title')

const { t } = useI18n()
</script>

<template>
  <NuxtLayout name="default">
    <Heading tag="h3" position="center">{{ t('calls.call') }}</Heading>
    <GameCallForm />
  </NuxtLayout>
</template>
