<script setup lang="ts">
import { Court } from '@/domain/court'
import { Sede } from '@/domain/sede'
import SedeService from '@/services/sede'
import { mapApiSedeToSede } from '@/domain/sede'

const props = defineProps({
  groupedCourts: {
    type: Array as PropType<Sede[]>,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'court:selected', value: Court): void
}>()

const { t } = useI18n()
const sedeService = new SedeService()

const selectedCourt = ref<Court>()
const loadingApi = ref<boolean>(false)

const groupedCourts = ref<Sede[]>(props.groupedCourts ?? [])
const options = computed(
  (): Sede[] => props.groupedCourts ?? groupedCourts.value,
)

const getGroupedCourts = async () => {
  loadingApi.value = true
  const { data } = await sedeService.fetch({
    where_has: 'courts',
    with: 'courts',
  })
  groupedCourts.value = data.value?.data.sedes.map(mapApiSedeToSede) ?? []
  loadingApi.value = false
}

onMounted(() => {
  if (!groupedCourts.value.length) {
    getGroupedCourts()
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
    :placeholder="t('courts.select')"
    @update:modelValue="emit('court:selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'SedeCourtSelector',
}
</script>
