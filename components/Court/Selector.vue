<script setup lang="ts">
import { Court, mapApiCourtToCourt } from '@/domain/court'
import CourtService from '@/services/court'

const props = defineProps({
  courts: {
    type: Array as PropType<Court[]>,
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
const courtService = new CourtService()

const selectedCourt = ref<Court | null>(null)
const loadingApi = ref<boolean>(false)
const courts = ref<Court[]>([])

const options = computed((): Court[] => props.courts ?? courts.value)

const getCourts = async () => {
  loadingApi.value = true
  const { data } = await courtService.fetch()
  courts.value = data.value?.data.courts.map(mapApiCourtToCourt) ?? []
  loadingApi.value = false
}

onMounted(() => {
  if (!courts.value.length) {
    getCourts()
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
    optionValue="id"
    scrollHeight="210px"
    :placeholder="t('courts.select')"
    @update:modelValue="emit('court:selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'CourtSelector',
}
</script>
