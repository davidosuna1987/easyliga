<script setup lang="ts">
import DivisionService from '@/services/division'
import { Division, mapApiDivisionToDivision } from '@/domain/division'

const divisionService = new DivisionService()

const props = defineProps({
  divisions: {
    type: Array as PropType<Division[]>,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'division:selected', value: Division): void
}>()

const { t } = useI18n()

const selectedDivision = ref<Division>()
const loadingApi = ref<boolean>(false)

const divisions = ref<Division[]>(props.divisions ?? [])
const options = computed((): Division[] => props.divisions ?? divisions.value)

const getDivisions = async () => {
  loadingApi.value = true
  const { data } = await divisionService.fetch()
  divisions.value =
    data.value?.data.divisions?.map(mapApiDivisionToDivision) ?? []
  loadingApi.value = false
}

onMounted(() => {
  if (!divisions.value.length) {
    getDivisions()
  }
})
</script>

<template>
  <Dropdown
    class="easy-divisions-selector-component"
    v-model="selectedDivision"
    :loading="props.loading || loadingApi"
    :options="options"
    optionLabel="name"
    scrollHeight="210px"
    :placeholder="t('divisions.select')"
    @update:modelValue="emit('division:selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'DivisionSelector',
}
</script>
