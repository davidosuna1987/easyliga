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
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'federation:selected', value: Federation): void
  (e: 'federations:fetch', value: Federation[]): void
}>()

const { t } = useI18n()
const easyStorage = useEasyStorage()
const federationStore = useFederationStore()

const selectedFederation = ref<Federation>()
const loadingApi = ref<boolean>(false)

const selectableFederations = ref<Federation[]>(
  props.federations ??
    easyStorage
      .getNested('federations.groupedFederations', [])
      .map(mapApiFederationToFederation),
)

const options = computed(
  (): Federation[] => props.federations ?? selectableFederations.value,
)

const getFederations = async () => {
  loadingApi.value = true
  const { data } = await federationStore.fetch(
    props.with ? { with: props.with } : {},
  )
  selectableFederations.value = federationStore.groupedFederations.map(
    mapApiFederationToFederation,
  )

  easyStorage.set(
    'federations.groupedFederations',
    data.value?.data.federations,
  )

  emit(
    'federations:fetch',
    data.value?.data.federations.map(mapApiFederationToFederation) ?? [],
  )
  loadingApi.value = false
}

onMounted(() => {
  if (!props.federations) {
    getFederations()
  }
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
    @update:modelValue="emit('federation:selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'FederationSelector',
}
</script>
