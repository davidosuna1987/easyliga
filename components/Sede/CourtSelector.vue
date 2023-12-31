<script setup lang="ts">
import { ApiCourt } from '@/types/api/court'
import { ApiSede } from '@/types/api/sede'
import SedeService from '@/services/sede'

const sedeService = new SedeService()

const props = defineProps({
  groupedCourts: {
    type: Array as PropType<ApiSede[]>,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['court:selected'])

const selectedCourt = ref<ApiCourt | null>(null)
const loadingApi = ref<boolean>(false)

const groupedCourts = ref<ApiSede[]>(props.groupedCourts ?? [])
const options = computed(
  (): ApiSede[] => props.groupedCourts ?? groupedCourts.value,
)

const selectCourt = (court: ApiCourt) => {
  emit('court:selected', court)
}

onMounted(async () => {
  if (!props.groupedCourts) {
    loadingApi.value = true
    const response = await sedeService.fetch({
      where_has: 'courts',
      with: 'courts',
    })
    groupedCourts.value = response.data.value?.data.sedes as ApiSede[]
    loadingApi.value = false
  }
})
</script>

<template>
  <Dropdown
    class="easy-courts-selector-component"
    v-model="selectedCourt"
    :loading="props.loading || loadingApi"
    :options="options"
    optionLabel="name"
    optionGroupChildren="courts"
    optionGroupLabel="name"
    scrollHeight="210px"
    :placeholder="$t('courts.select')"
    @update:modelValue="selectCourt"
  />
</template>

<script lang="ts">
export default {
  name: 'SedeCourtSelector',
}
</script>
