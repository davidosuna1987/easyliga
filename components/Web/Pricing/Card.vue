<script setup lang="ts">
import { PricingPlan, PricingPlanTemporality } from 'domain/pricing-plan'
import { formatMoney } from '@/domain/utils'

const props = defineProps({
  pricingPlan: {
    type: Object as PropType<PricingPlan>,
    required: true,
  },
  temporality: {
    type: String as PropType<PricingPlanTemporality>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'moreInfo'): void
}>()

const { t } = useI18n()

const { title, pricing, highlighted } = props.pricingPlan

const pricingPlanTranslation = (key: string) => {
  return t(`pricing_plans.${title.toLocaleLowerCase()}.${key}`)
}

const pricingPlanFeatures = () => {
  return Array.from({ length: 8 }, (_, i) =>
    pricingPlanTranslation(`features.${i}`),
  ).filter(feature => feature !== '')
}

const handleRequestInfo = () => {
  easyEmit('info-request:dialog:show', {
    pricingPlan: props.pricingPlan,
    temporality: props.temporality,
    infoOnly: false,
  })
}
</script>

<template>
  <article
    class="easy-web-price-card-component has-shadow has-border grid gap-6 w-full flex-1 py-8 px-4 sm:p-12 lg:px-16 rounded-lg"
  >
    <EasyTextHighlight
      v-if="highlighted"
      width="140%"
      left="-18%"
      class="mx-auto"
    >
      <header class="font-medium text-center text-3xl">
        {{ pricingPlanTranslation('title') }}
      </header>
    </EasyTextHighlight>
    <header v-else class="font-medium text-center text-3xl">
      {{ pricingPlanTranslation('title') }}
    </header>
    <p class="leading-6">{{ pricingPlanTranslation('description') }}</p>

    <div class="flex items-center gap-2">
      <span class="font-bold text-2xl">
        {{ formatMoney(pricing[temporality], 'EUR', true, undefined) }}
      </span>
      <span>/</span>
      <span class="font-medium">
        {{ t(`forms.${temporality}`).toLocaleLowerCase() }}
      </span>
    </div>

    <ul class="list-none flex flex-col gap-4 flex-1">
      <li
        v-for="feature in pricingPlanFeatures()"
        class="flex items-center gap-2"
      >
        <EasyIcon name="checkCircle" class="text-primary" />
        <span class="leading-6">
          {{ feature }}
        </span>
      </li>
    </ul>

    <Button
      :label="t('pricing_plans.request')"
      :outlined="!highlighted"
      @click.prevent="handleRequestInfo"
    />

    <a
      class="place-self-end text-gray-500 dark:text-gray-600 -mt-3"
      @click="emit('moreInfo')"
    >
      {{ t('pricing_plans.conditions.title') }}
    </a>
  </article>
</template>

<script lang="ts">
export default {
  name: 'WebPriceCard',
}
</script>
