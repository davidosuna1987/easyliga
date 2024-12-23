<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div
    class="easy-web-price-card-component bg-surface-0 dark:bg-surface-950 pb-24"
  >
    <header class="relative mb-6 lg:mb-8">
      <EasyMask class="sm:hidden" :mask="2" />
      <EasyMask class="hidden sm:block" :mask="3" />
      <div class="heading">
        <WebHeroTitle class="mb-5" tag="h2">
          {{ t('pricing_plans.title') }}
        </WebHeroTitle>
        <WebHeroTitle class="subtitle" tag="h3">
          {{ t('pricing_plans.subtitle') }}
        </WebHeroTitle>
      </div>
    </header>

    <WebPricingCarousel />
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/common/breakpoints.scss';

.easy-web-price-card-component {
  .heading {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    height: 100%;
    display: grid;
    place-content: center;
  }

  .subtitle {
    font-size: 1.1rem;
    line-height: 1.25rem;
    max-width: 550px;
    margin-inline: auto;

    @media (min-width: $media-md) {
      font-size: 1.75rem;
      line-height: 2rem;
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'WebPriceCard',
}
</script>
