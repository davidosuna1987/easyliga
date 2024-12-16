<script setup lang="ts">
import { League } from '@/domain/league'

definePageMeta({
  title: 'pages.classification.title',
  description: 'pages.classification.description',
  heroSize: 400,
})

useEasyHead('pages.classification.title')

const selectedLeague = ref<League>()

const { t } = useI18n()
</script>

<template>
  <NuxtLayout name="default">
    <template #hero>
      <EasyAnimatedBackground :size="400" isHeroSection>
        <Heading class="mb-5" tag="h3" position="center">
          {{ t('Clasificación') }}
        </Heading>

        <WebLeagueSelector
          @league:selected="selectedLeague = $event"
          isHeroSection
        />
      </EasyAnimatedBackground>
    </template>

    <div class="easy-web-classification-page">
      <WebClassification class="pb-10" :selectedLeague="selectedLeague" />
    </div>
  </NuxtLayout>
</template>
