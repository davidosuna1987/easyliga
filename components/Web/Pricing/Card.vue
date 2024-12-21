<script setup lang="ts">
import { PricingPlanTemporality } from 'domain/pricing-plan'
import { formatMoney } from '@/domain/utils'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  temporality: {
    type: String as PropType<PricingPlanTemporality>,
    default: 'year',
  },
  features: {
    type: Array as PropType<string[]>,
    required: true,
  },
  highlighted: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'moreInfo'): void
}>()

const { t } = useI18n()
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
      <header class="font-medium text-center text-3xl">{{ title }}</header>
    </EasyTextHighlight>
    <header v-else class="font-medium text-center text-3xl">{{ title }}</header>
    <p class="leading-6">{{ description }}</p>

    <div class="flex items-center gap-2">
      <span class="font-bold text-2xl">
        {{ formatMoney(price, 'EUR', true, undefined) }}
      </span>
      <span>/</span>
      <span class="font-medium">
        {{ t(`forms.${temporality}`).toLocaleLowerCase() }}
      </span>
    </div>

    <ul class="list-none flex flex-col gap-4 flex-1">
      <li v-for="feature in features" class="flex items-center gap-2">
        <EasyIcon name="checkCircle" class="text-primary" />
        <span class="leading-6">
          {{ feature }}
        </span>
      </li>
    </ul>

    <Button label="Buy Now" :outlined="!highlighted" />

    <a
      class="place-self-end text-gray-500 dark:text-gray-600 -mt-3"
      @click="emit('moreInfo')"
    >
      {{ t('pricing_plan.conditions.title') }}
    </a>
  </article>
</template>

<script lang="ts">
export default {
  name: 'WebPriceCard',
}
</script>
