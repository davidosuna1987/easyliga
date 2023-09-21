<script setup lang="ts">
import { useFederationStore } from '@/stores/useFederationStore'
import { ApiFederation } from '@/types/api/federation'

const easyStorage = useEasyStorage()
const federationStore = useFederationStore()

const props = defineProps({
  federations: {
    type: Array as PropType<ApiFederation[]>,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const selectedFederation = ref<ApiFederation>()
const loadingApi = ref<boolean>(false)

const nationalFederations = ref<ApiFederation[]>(
  props.federations ??
    easyStorage.getNested('federations.nationalFederations', []),
)
const options = computed(
  (): ApiFederation[] => props.federations ?? nationalFederations.value,
)

onMounted(async () => {
  if (!props.federations) {
    loadingApi.value = true
    await federationStore.fetch()
    nationalFederations.value = federationStore.nationalFederations
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
    optionValue="id"
    scrollHeight="210px"
    :placeholder="$t('federations.select')"
    @update:modelValue="$emit('selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'FederationSelector',
}
</script>
