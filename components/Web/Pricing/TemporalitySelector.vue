<script setup lang="ts">
import {
  PricingPlanTemporality,
  PRICING_PLAN_TEMPORALITY_MAP,
} from '@/domain/pricing-plan'

const props = defineProps({
  selected: {
    type: String as PropType<PricingPlanTemporality>,
    required: false,
  },
  readonly: {
    type: Boolean,
    default: false,
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
  (e: 'temporality:selected', value: PricingPlanTemporality | undefined): void
}>()

const { t } = useI18n()

const selectedTemporality = ref<PricingPlanTemporality | undefined>(
  props.selected,
)

const options = computed((): PricingPlanTemporality[] => [
  PRICING_PLAN_TEMPORALITY_MAP.month,
  PRICING_PLAN_TEMPORALITY_MAP.year,
])

const pointerEventsNone = computed(
  () => props.readonly || props.disabled || props.loading,
)

const setSelectedTemporality = (temporality?: PricingPlanTemporality) => {
  selectedTemporality.value = temporality
  emit('temporality:selected', selectedTemporality.value)
}

const handleClick = (temporality: PricingPlanTemporality) => {
  if (pointerEventsNone.value) return
  setSelectedTemporality(temporality)
}

watch(
  () => props.selected,
  value => {
    setSelectedTemporality(value)
  },
  { immediate: true },
)
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
      :class="[{ 'pointer-events-none': pointerEventsNone }]"
      :label="t(`pricing_plans.temporality.${temporality}`)"
      :size="'small'"
      :outlined="!selectedTemporality || selectedTemporality !== temporality"
      @click="handleClick(temporality)"
    />
  </EasyGrid>
</template>

<script lang="ts">
export default {
  name: 'WebPricingTemporalitySelector',
}
</script>
