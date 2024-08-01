<script setup lang="ts">
import FederationService from '@/services/federation'
import {
  Federation,
  flattenFederations,
  mapApiFederationToFederation,
} from '@/domain/federation'
import { Division } from '@/domain/division'

const federationService = new FederationService()

const props = defineProps({
  groupedDivisions: {
    type: Array as PropType<Federation[]>,
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

const groupedDivisions = ref<Federation[]>(props.groupedDivisions ?? [])
const options = computed(
  (): Federation[] => props.groupedDivisions ?? groupedDivisions.value,
)

const getDivisions = async () => {
  loadingApi.value = true
  const { data } = await federationService.fetch({
    with: 'divisions,federation.divisions',
  })
  groupedDivisions.value = flattenFederations(
    data.value?.data.federations?.map(mapApiFederationToFederation) ?? [],
  )

  selectDivisionIfOnlyOneOption(groupedDivisions.value)

  loadingApi.value = false
}

const selectDivisionIfOnlyOneOption = (federations: Federation[]) => {
  if (federations.length === 1) {
    const federation = federations[0]

    if (federation.divisions?.length === 1) {
      selectedDivision.value = federation.divisions[0]
      emit('division:selected', federation.divisions[0])
    }
  }
}

watch(
  () => props.groupedDivisions,
  () => {
    groupedDivisions.value = props.groupedDivisions ?? []
    selectDivisionIfOnlyOneOption(groupedDivisions.value)
  },
)

onMounted(() => {
  if (!props.groupedDivisions?.length) {
    getDivisions()
  }
})
</script>

<template>
  <Dropdown
    v-if="!!props.groupedDivisions"
    class="easy-courts-selector-component"
    v-model="selectedDivision"
    :loading="props.loading || loadingApi"
    :options="groupedDivisions"
    optionLabel="name"
    optionGroupChildren="divisions"
    optionGroupLabel="name"
    scrollHeight="210px"
    :placeholder="t('divisions.select')"
    @update:modelValue="emit('division:selected', $event)"
  />
  <Dropdown
    v-else
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
