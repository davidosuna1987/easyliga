<script setup lang="ts">
import DivisionService from '@/services/division'
import { ApiDivision } from '@/types/api/division'

const divisionService = new DivisionService()

const props = defineProps({
  divisions: {
    type: Array as PropType<ApiDivision[]>,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const selectedDivision = ref<ApiDivision | null>(null)
const loadingApi = ref<boolean>(false)

const divisions = ref<ApiDivision[]>(props.divisions ?? [])
const options = computed(
  (): ApiDivision[] => props.divisions ?? divisions.value,
)

onMounted(async () => {
  if (!props.divisions) {
    loadingApi.value = true
    const response = await divisionService.fetch()
    divisions.value = response.data.value?.data.divisions ?? []
    loadingApi.value = false
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
    optionValue="id"
    scrollHeight="210px"
    :placeholder="$t('divisions.select')"
    @update:modelValue="$emit('selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'DivisionSelector',
}
</script>
