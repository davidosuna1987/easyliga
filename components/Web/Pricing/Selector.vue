<script setup lang="ts">
import { pricingPlans, PricingPlan } from '@/domain/pricing-plan'

const props = defineProps({
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

const selectedPricingPlan = ref<PricingPlan>()

const options = computed((): PricingPlan[] => pricingPlans)

const setSelectedPricingPlan = (pricingPlan?: PricingPlan) => {
  selectedPricingPlan.value = pricingPlan
  emit('pricingPlan:selected', selectedPricingPlan.value)
}
</script>

<template>
  <Dropdown
    class="easy-web-pricing-selector-component"
    v-model="selectedPricingPlan"
    :disabled="props.disabled"
    :options="options"
    optionLabel="title"
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
