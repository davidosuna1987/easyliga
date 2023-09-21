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

const selectedDivision = ref<Division>()
const loadingApi = ref<boolean>(false)

const divisions = ref<Division[]>(props.divisions ?? [])
const options = computed((): Division[] => props.divisions ?? divisions.value)

onMounted(async () => {
  if (!props.divisions) {
    loadingApi.value = true
    const response = await divisionService.fetch()
    divisions.value =
      response.data.value?.data.divisions?.map(mapApiDivisionToDivision) ?? []
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
