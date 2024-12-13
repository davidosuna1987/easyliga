<script setup lang="ts">
import { useFederationStore } from '@/stores/useFederationStore'
import { Federation, mapApiFederationToFederation } from '@/domain/federation'

const props = defineProps({
  federations: {
    type: Array as PropType<Federation[]>,
    required: false,
  },
  with: {
    type: String,
    default: '',
  },
  withCount: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hiddenFederationIds: {
    type: Array as PropType<number[]>,
    default: [],
  },
})

const emit = defineEmits<{
  (e: 'federation:selected', value: Federation | undefined): void
  (e: 'federations:fetch', value: Federation[]): void
}>()

const { t } = useI18n()
const easyStorage = useEasyStorage()
const federationStore = useFederationStore()

const selectedFederation = ref<Federation>()
const loadingApi = ref<boolean>(false)

const selectableFederations = ref<Federation[]>(props.federations ?? [])

const options = computed((): Federation[] => {
  const federations = props.federations ?? selectableFederations.value

  federations.forEach(federation => {
    federation.federations =
      federation.federations?.filter(
        federation => !props.hiddenFederationIds.includes(federation.id),
      ) ?? undefined
  })
  return federations.filter(
    federation => !props.hiddenFederationIds.includes(federation.id),
  )
})

const getFederations = async () => {
  loadingApi.value = true
  const { data } = await federationStore.fetch({
    ...(props.with && { with: props.with }),
    ...(props.withCount && { with_count: props.withCount }),
  })
  selectableFederations.value = federationStore.groupedFederations.map(
    mapApiFederationToFederation,
  )

  easyStorage.set(
    'federations.groupedFederations',
    data.value?.data.federations,
  )

  const federations =
    data.value?.data.federations.map(mapApiFederationToFederation) ?? []

  emit('federations:fetch', federations)

  setSelectedFederationIfOnlyOneSelectable()

  loadingApi.value = false
}

const setSelectedFederationIfOnlyOneSelectable = () => {
  if (
    options.value.length === 1 &&
    options.value[0].federations &&
    options.value[0].federations.length === 1
  ) {
    setSelectedFederation(options.value[0].federations[0])
  }
}

const setSelectedFederation = (federation?: Federation) => {
  selectedFederation.value = federation
  emit('federation:selected', selectedFederation.value)
}

watch(
  () => props.hiddenFederationIds,
  value => {
    if (
      selectedFederation.value &&
      value.includes(selectedFederation.value.id)
    ) {
      setSelectedFederation()
    }

    setSelectedFederationIfOnlyOneSelectable()
  },
)

onMounted(() => {
  if (!props.federations) {
    getFederations()
  }

  setSelectedFederationIfOnlyOneSelectable()
})
</script>

<template>
  <Dropdown
    class="easy-federations-selector-component"
    v-model="selectedFederation"
    :loading="props.loading || loadingApi"
    :disabled="props.disabled"
    :options="options"
    optionLabel="name"
    :optionValue="federation => federation"
    optionGroupChildren="federations"
    optionGroupLabel="name"
    scrollHeight="210px"
    :placeholder="t('federations.select')"
    @update:modelValue="setSelectedFederation"
  />
</template>

<script lang="ts">
export default {
  name: 'FederationSelector',
}
</script>
