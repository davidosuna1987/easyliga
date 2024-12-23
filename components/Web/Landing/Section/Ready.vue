<script setup lang="ts">
const { t } = useI18n()

const showInfoRequestFormDialog = ref(false)
</script>

<template>
  <div class="easy-web-landing-section-ready-component">
    <div class="flex flex-col items-center justify-center py-32">
      <WebHeroTitle class="mb-8" tag="h2">
        {{ t('pages.landing.ready.title') }}
      </WebHeroTitle>
      <WebHeroTitle class="subtitle" tag="h3">
        {{ t('pages.landing.ready.subtitle_1') }}
      </WebHeroTitle>
      <WebHeroTitle class="subtitle" tag="h3">
        {{ t('pages.landing.ready.subtitle_2') }}
      </WebHeroTitle>
      <div class="mt-8">
        <Button
          type="submit"
          size="large"
          raised
          @click.prevent="showInfoRequestFormDialog = true"
        >
          {{ t('pages.landing.hero.button') }}
        </Button>
      </div>
    </div>

    <InfoRequestStoreFormDialog
      :visible="showInfoRequestFormDialog"
      @hide="showInfoRequestFormDialog = false"
    />
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/common/breakpoints.scss';

.easy-web-landing-section-ready-component {
  .subtitle {
    font-size: 1.1rem;
    line-height: 1.25rem;
    max-width: 750px;
    margin-inline: auto;
    margin-block-end: 1.5rem;

    @media (min-width: $media-md) {
      font-size: 1.75rem;
      line-height: 2rem;
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'NamedComponent',
}
</script>
