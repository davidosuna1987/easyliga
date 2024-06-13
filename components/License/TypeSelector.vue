<script setup lang="ts">
import { LicensableType, LICENSABLE_TYPES } from '@/domain/licensable'

const props = defineProps({
  type: {
    type: String as PropType<LicensableType>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'type:selected', value: LicensableType): void
}>()

const selectedType = ref<LicensableType | undefined>(props.type)

const setSeslectedType = () => {
  selectedType.value = props.type
}

watch(() => props.type, setSeslectedType, { immediate: true })
</script>

<template>
  <pre>{{ selectedType }}</pre>
  <Dropdown
    class="easy-license-type-selector-component"
    v-model="selectedType"
    :options="type ? [type] : LICENSABLE_TYPES"
    scrollHeight="210px"
    :placeholder="$t('licenses.select_type')"
    @update:modelValue="emit('type:selected', $event)"
  >
    <template #value="slotProps">
      {{ $t(`licenses.type.${slotProps.value}`) }}
    </template>
    <template #option="slotProps">
      {{ $t(`licenses.type.${slotProps.option}`) }}
    </template>
  </Dropdown>
</template>

<script lang="ts">
export default {
  name: 'LicenseTypeSelector',
}
</script>
