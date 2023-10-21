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
      :severity="key"
      :selected="selectedSanction === key"
      @sanction:selected="handleSanctionSelected"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'SanctionGrid',
}
</script>
