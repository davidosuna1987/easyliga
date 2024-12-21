<script setup lang="ts">
import { League } from '@/domain/league'

const props = defineProps({
  imageUrl: {
    type: String,
    default: '/images/background.svg',
    // default: '/images/landing/anime-style-background-landscape.jpeg',
  },
})

const emit = defineEmits<{
  (e: 'league:selected', value: League | undefined): void
}>()

const { t } = useI18n()
</script>

<template>
  <EasyAnimatedBackground
    class="easy-web-classification-hero-component easy-hero-guest"
    :imageUrl="imageUrl"
    backgroundSize="cover"
    :hasOpacity="false"
    :interactive="false"
    :size="500"
    isHeroSection
  >
    <WebHeroTitle class="mb-10" tag="h2">
      {{ t('Clasificación') }}
    </WebHeroTitle>

    <WebLeagueSelector
      @league:selected="emit('league:selected', $event)"
      isHeroSection
    />
  </EasyAnimatedBackground>
</template>

<script lang="ts">
export default {
  name: 'WebClassificationHero',
}
</script>
