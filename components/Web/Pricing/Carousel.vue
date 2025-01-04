<script setup lang="ts">
import { usePricingPlanStore } from '@/stores/usePricingPlanStore'
import {
  PricingPlan,
  PricingPlanTemporality,
  pricingPlansSkeleton,
} from '@/domain/pricing-plan'

const { t } = useI18n()
const emit = defineEmits()

const { pricingPlans, fetchPricingPlans } = usePricingPlanStore()

const selectablePricingPlans = ref<PricingPlan[]>(
  pricingPlans.length ? pricingPlans : pricingPlansSkeleton,
)
const interval = ref<PricingPlanTemporality>('month')
const activeIndex = ref<number>(0)
const moreInfoModalVisible = ref<boolean>(false)
const loadingApi = ref<boolean>(false)

const selectedPlan = computed(() => {
  return selectablePricingPlans.value[activeIndex.value]
})

const setInterval = (newInterval: PricingPlanTemporality) => {
  interval.value = newInterval
}

const setSelectablePricingPlans = async () => {
  setHiglightedActiveIndex()

  if (!pricingPlans.length) {
    loadingApi.value = true
    const plansFromStore = await fetchPricingPlans()
    selectablePricingPlans.value = [...(plansFromStore.data.value ?? [])]
    loadingApi.value = false
  } else {
    selectablePricingPlans.value = [...pricingPlans]
  }

  setHiglightedActiveIndex()
}

const setHiglightedActiveIndex = () => {
  const highlightedIndex = selectablePricingPlans.value.findIndex(
    plan => plan.highlighted,
  )
  if (highlightedIndex !== -1) {
    activeIndex.value = highlightedIndex
  }
}

watch(selectedPlan, value => {
  emit('selected', value)
})

onMounted(() => {
  setSelectablePricingPlans()
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
        {{ t('pricing_plans.temporality.month') }}
      </Button>
      <span class="ml-3 is-muted"></span>
      <Button
        class="p-button uppercase py-1 px-4"
        :class="{ 'p-button-text': interval === 'month' }"
        @click.prevent="setInterval('year')"
      >
        {{ t('pricing_plans.temporality.year') }}
      </Button>
    </div>

    <EasyCarousel :activeIndex="activeIndex">
      <WebPricingCard
        v-for="pricingPlan in selectablePricingPlans"
        :key="`${pricingPlan.id}-${interval}`"
        :pricingPlan="pricingPlan"
        :temporality="interval"
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
