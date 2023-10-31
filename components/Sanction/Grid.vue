<script setup lang="ts">
import {
  SanctionType,
  SanctionSeverityKey,
  SANCTION_SEVERITY_MEMBER,
  SANCTION_SEVERITY_TEAM,
} from '@/domain/sanction'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  availableSeverities: {
    type: Array as PropType<SanctionSeverityKey[]>,
    default: [],
  },
})

const emit = defineEmits(['sanction:selected'])

const selectedSanction = ref<SanctionSeverityKey>()

const iterationSeverities = computed(() =>
  props.type === SanctionType.team
    ? SANCTION_SEVERITY_TEAM
    : SANCTION_SEVERITY_MEMBER,
)

const handleSanctionSelected = (severity: SanctionSeverityKey) => {
  selectedSanction.value = severity
  emit('sanction:selected', severity)
}
</script>

<template>
  <div class="easy-sanction-grid-component grid grid-cols-2 gap-3 mt-3">
    <SanctionItem
      v-for="key in iterationSeverities"
      :key="key"
      :disabled="!props.availableSeverities.includes(key as SanctionSeverityKey)"
      :severity="key"
      :selected="selectedSanction === key"
      @sanction:selected="handleSanctionSelected"
    />
  </div>
</template>

<style scoped lang="scss">
.easy-sanction-grid-component {
  .easy-sanction-item-component {
    padding: 1rem;

    &:hover {
      cursor: pointer;
      border-color: var(--primary-color-medium);
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'SanctionGrid',
}
</script>
