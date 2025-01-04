<script setup lang="ts">
import { usePricingPlanStore } from '@/stores/usePricingPlanStore'
import { pricingPlansSkeleton, PricingPlan } from '@/domain/pricing-plan'

const props = defineProps({
  selectedTitle: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'pricingPlan:selected', value: PricingPlan | undefined): void
}>()

const { t } = useI18n()
const { pricingPlans, fetchPricingPlans } = usePricingPlanStore()

const loadingApi = ref<boolean>(props.loading)
const selectedPricingPlan = ref<PricingPlan>()
const selectablePricingPlans = ref<PricingPlan[]>(
  pricingPlans.length ? pricingPlans : pricingPlansSkeleton,
)

const options = computed((): PricingPlan[] =>
  pricingPlans.length ? pricingPlans : pricingPlansSkeleton,
)

const setSelectedPricingPlan = (pricingPlan?: PricingPlan) => {
  selectedPricingPlan.value = pricingPlan
  emit('pricingPlan:selected', selectedPricingPlan.value)
}

const setSelectablePricingPlans = async () => {
  if (!pricingPlans.length) {
    loadingApi.value = true
    const plansFromStore = await fetchPricingPlans()
    selectablePricingPlans.value = plansFromStore.data.value ?? []
    loadingApi.value = false
  }
}

watch(
  () => props.selectedTitle,
  value => {
    const pricingPlan = selectablePricingPlans.value.find(
      plan => plan.title === value,
    )

    setSelectedPricingPlan(pricingPlan)
  },
  { immediate: true },
)

onMounted(() => {
  setSelectablePricingPlans()
})
</script>

<template>
  <Dropdown
    class="easy-web-pricing-selector-component"
    v-model="selectedPricingPlan"
    :disabled="props.disabled || props.loading || loadingApi"
    :options="options"
    :optionLabel="
      pricingPlan =>
        t(`pricing_plans.${pricingPlan.title.toLocaleLowerCase()}.title`)
    "
    scrollHeight="210px"
    :placeholder="t('pricing_plans.select')"
    @update:modelValue="setSelectedPricingPlan"
  />
</template>

<script lang="ts">
export default {
  name: 'WebPricingSelector',
}
</script>
