<script setup lang="ts">
import { useFederationStore } from '@/stores/useFederationStore'
import { Federation, mapApiFederationToFederation } from '@/domain/federation'

const props = defineProps({
  federations: {
    type: Array as PropType<Federation[]>,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'federation:selected', value: Federation): void
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

onMounted(async () => {
  if (!props.federations) {
    loadingApi.value = true
    await federationStore.fetch()
    selectableFederations.value = federationStore.groupedFederations.map(
      mapApiFederationToFederation,
    )
    loadingApi.value = false
  }
})
</script>

<template>
  <Dropdown
    class="easy-federations-selector-component"
    v-model="selectedFederation"
    :loading="props.loading || loadingApi"
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
