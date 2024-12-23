<script setup lang="ts">
import {
  PricingPlanTemporality,
  PRICING_PLAN_TEMPORALITY_MAP,
} from '@/domain/pricing-plan'

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
  (e: 'temporality:selected', value: PricingPlanTemporality | undefined): void
}>()

const { t } = useI18n()

const selectedTemporality = ref<PricingPlanTemporality>()

const options = computed((): PricingPlanTemporality[] => [
  PRICING_PLAN_TEMPORALITY_MAP.month,
  PRICING_PLAN_TEMPORALITY_MAP.year,
])

const setSelectedTemporality = (temporality?: PricingPlanTemporality) => {
  selectedTemporality.value = temporality
  emit('temporality:selected', selectedTemporality.value)
}
</script>

<template>
  <EasyGrid
    class="easy-web-pricing-temporality-selector-component"
    :cols="2"
    :gap="3"
  >
    <Button
      v-for="temporality in options"
      :key="temporality"
      :label="t(`pricing_plans.temporality.${temporality}`)"
      :size="'small'"
      :outlined="!selectedTemporality || selectedTemporality !== temporality"
      @click="setSelectedTemporality(temporality)"
    />
  </EasyGrid>
</template>

<script lang="ts">
export default {
  name: 'WebPricingTemporalitySelector',
}
</script>
