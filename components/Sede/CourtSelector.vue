<script setup lang="ts">
import { ApiCourt } from '@/types/api/court'
import { ApiSedeWithCourts } from '@/types/api/sede'
import SedeService from '@/services/sede'

const sedeService = new SedeService()

const props = defineProps({
  groupedCourts: {
    type: Array as PropType<ApiSedeWithCourts[]>,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const selectedCourt = ref<ApiCourt | null>(null)
const loadingApi = ref<boolean>(false)

const groupedCourts = ref<ApiSedeWithCourts[]>([])
const options = computed(
  (): ApiSedeWithCourts[] => props.groupedCourts ?? groupedCourts.value,
)

onMounted(async () => {
  if (!props.groupedCourts) {
    loadingApi.value = true
    const response = await sedeService.fetch({
      where_has: 'courts',
      with: 'courts',
    })
    groupedCourts.value = response.data.value?.data.sedes as ApiSedeWithCourts[]
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
    :optionValue="court => court"
    optionGroupChildren="courts"
    optionGroupLabel="name"
    scrollHeight="210px"
    :placeholder="$t('courts.select')"
    @update:modelValue="$emit('selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'SedeCourtSelector',
}
</script>
