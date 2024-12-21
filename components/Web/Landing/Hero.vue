<script setup lang="ts">
const props = defineProps({
  size: {
    type: Number,
    default: 400,
  },
  imageUrl: {
    type: String,
    default: '/images/background.svg',
    // default: '/images/landing/anime-style-background-landscape.jpeg',
  },
})

const { t } = useI18n()

const email = ref('')
</script>

<template>
  <!-- /images/landing/anime-style-background-landscape.jpeg -->
  <EasyAnimatedBackground
    class="easy-web-landing-hero-component easy-hero-guest"
    :imageUrl="imageUrl"
    backgroundSize="cover"
    :hasOpacity="false"
    :interactive="false"
    :size="size"
    isHeroSection
  >
    <WebHeroTitle>{{ t('pages.landing.hero.title') }}</WebHeroTitle>
    <WebHeroTitle tag="h2" highlighted>
      {{ t('pages.landing.hero.subtitle') }}
    </WebHeroTitle>
    <p
      class="text-center mt-4 text-3xl leading-none max-w-lg mx-auto text-white [text-shadow:var(--stroke-shadow)]"
    >
      {{ t('pages.landing.hero.text') }}
    </p>
    <div class="flex justify-center space-x-3 mt-8">
      <InputText
        v-model="email"
        type="email"
        placeholder="Tu correo electrónico"
        class="px-4 py-3 border rounded-lg w-64"
      />
      <Button>{{ t('pages.landing.hero.button') }}</Button>
    </div>
  </EasyAnimatedBackground>
</template>

<script lang="ts">
export default {
  name: 'WebLandingHero',
}
</script>
