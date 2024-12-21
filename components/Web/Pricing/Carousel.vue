<script setup lang="ts">
import { pricingPlans, PricingPlanTemporality } from '@/domain/pricing-plan'

const { t } = useI18n()
const emit = defineEmits()

const interval = ref<PricingPlanTemporality>('month')
const activeIndex = ref<number>(0)
const moreInfoModalVisible = ref<boolean>(false)

const selectedPlan = computed(() => {
  return pricingPlans[activeIndex.value]
})

const setInterval = (newInterval: PricingPlanTemporality) => {
  interval.value = newInterval
}

watch(selectedPlan, value => {
  emit('selected', value)
})

const setHiglightedActiveIndex = () => {
  const highlightedIndex = pricingPlans.findIndex(plan => plan.highlighted)
  if (highlightedIndex !== -1) {
    activeIndex.value = highlightedIndex
  }
}

onMounted(() => {
  setHiglightedActiveIndex()
})
</script>

<template>
  <section class="easy-web-pricing-carousel-component">
    <div class="flex w-full justify-center align-items-center mb-6 fz-5">
      <Button
        class="p-button uppercase py-1 px-4"
        :class="{ 'p-button-text': interval === 'year' }"
        @click.prevent="setInterval('month')"
      >
        {{ t('pricing_plan.temporality.month') }}
      </Button>
      <span class="ml-3 is-muted"></span>
      <Button
        class="p-button uppercase py-1 px-4"
        :class="{ 'p-button-text': interval === 'month' }"
        @click.prevent="setInterval('year')"
      >
        {{ t('pricing_plan.temporality.year') }}
      </Button>
    </div>

    <EasyCarousel :activeIndex="activeIndex">
      <WebPricingCard
        v-for="(plan, index) in pricingPlans"
        :key="index"
        :title="plan.title"
        :description="plan.description"
        :price="plan.pricing[interval]"
        :temporality="interval"
        :features="plan.features"
        :highlighted="plan.highlighted"
        @moreInfo="moreInfoModalVisible = true"
      />
    </EasyCarousel>

    <WebPricingConditionsDialog
      :visible="moreInfoModalVisible"
      @hide="moreInfoModalVisible = false"
    />
  </section>
</template>

<style scoped lang="scss">
.easy-web-pricing-carousel-component {
  position: relative;
  max-width: 768px;
  margin-inline: auto;
}
</style>

<script lang="ts">
export default {
  name: 'WebPricingCarousel',
}
</script>
