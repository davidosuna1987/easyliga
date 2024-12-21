<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="easy-web-landing-section-details-component">
    <article class="grid md:grid-cols-5 gap-16 pt-20 pb-40">
      <div class="relative md:col-span-3 mb-10 md:mb-0">
        <EasyMask />
        <NuxtImg
          class="absolute top-4 -right-[20%] w-[125%] max-w-[125%] md:w-[100%] md:max-w-[100%]"
          src="/images/landing/arbitrate-smartphone.png"
        />
      </div>
      <div class="grid place-content-center md:col-span-2">
        <h3 class="text-5xl font-bold mb-6">
          {{ t('pages.landing.details.title') }}
        </h3>
        <p class="text-2xl mb-4">
          {{ t('pages.landing.details.text_1.part_1') }}
          <EasyTextHighlight>
            {{ t('pages.landing.details.text_1.highlight') }}
          </EasyTextHighlight>
          {{ t('pages.landing.details.text_1.part_2') }}
        </p>
        <p class="text-2xl">
          {{ t('pages.landing.details.text_2.part_1') }}
          <EasyTextHighlight>{{
            t('pages.landing.details.text_2.highlight')
          }}</EasyTextHighlight>
          {{ t('pages.landing.details.text_2.part_2') }}
        </p>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
export default {
  name: 'WebLandingSectionDetails',
}
</script>
