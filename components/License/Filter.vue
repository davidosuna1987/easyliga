<script setup lang="ts">
import { LicensableType } from '@/domain/licensable'

const props = defineProps({
  options: {
    type: Array as PropType<Array<LicensableType | 'all'>>,
    required: true,
  },
  type: {
    type: String as PropType<LicensableType | 'all'>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'type:selected', value: LicensableType | 'all'): void
}>()

const { t } = useI18n()

const selectedType = ref<LicensableType | 'all'>(props.type)

watch(
  () => props.type,
  value => {
    selectedType.value = value
  },
)
</script>

<template>
  <FormInputGroup class="easy-license-filter-component flex justify-center">
    <Button
      v-for="option in options"
      :key="option"
      :label="t(`licenses.type.${option}`)"
      :outlined="selectedType !== option"
      @click.prevent="emit('type:selected', option)"
    />
  </FormInputGroup>
</template>

<script lang="ts">
export default {
  name: 'LicenseFilter',
}
</script>
