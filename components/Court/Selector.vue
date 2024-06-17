<script setup lang="ts">
import { ApiCourt } from '@/types/api/court'
import CourtService from '@/services/court'

const props = defineProps({
  courts: {
    type: Array as PropType<ApiCourt[]>,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
const courtService = new CourtService()

const selectedCourt = ref<ApiCourt | null>(null)
const loadingApi = ref<boolean>(false)
const courts = ref<ApiCourt[]>([])

const options = computed((): ApiCourt[] => props.courts ?? courts.value)

onMounted(async () => {
  if (!props.courts) {
    loadingApi.value = true
    const response = await courtService.fetch()
    courts.value = response.data.value?.data.courts ?? []
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
    optionValue="id"
    scrollHeight="210px"
    :placeholder="t('courts.select')"
    @update:modelValue="$emit('selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'CourtSelector',
}
</script>
