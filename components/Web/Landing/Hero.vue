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

const email = ref<string>()
const showEmailInput = ref<boolean>(false)
const showInfoRequestFormDialog = ref<boolean>(false)

const setEmailValid = (newEmail?: string) => {
  showInfoRequestFormDialog.value = showEmailInput.value ? !!newEmail : true
  email.value = newEmail
}

const handleDialogHide = () => {
  showInfoRequestFormDialog.value = false
  email.value = undefined
}
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

    <InfoRequestReducedForm
      @email:valid="setEmailValid"
      :showInput="showEmailInput"
    />
    <InfoRequestStoreFormDialog
      :visible="showInfoRequestFormDialog"
      :email="email"
      @hide="handleDialogHide"
    />
  </EasyAnimatedBackground>
</template>

<script lang="ts">
export default {
  name: 'WebLandingHero',
}
</script>
