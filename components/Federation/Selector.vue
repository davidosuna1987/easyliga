<script setup lang="ts">
import { useFederationStore } from '@/stores/useFederationStore'
import { ApiFederation } from 'types/api/federation'

const easyStorage = useEasyStorage()
const federation = useFederationStore()

const selectedFederation = ref<ApiFederation | null>(null)

const federations = ref<ApiFederation[]>(
  easyStorage.getNested('federations.federations', []),
)

federation.fetch()
</script>

<template>
  <Dropdown
    class="easy-federations-selector-component"
    v-model="selectedFederation"
    :options="federations"
    optionLabel="name"
    optionValue="id"
    :placeholder="$t('federations.select')"
    @update:modelValue="$emit('selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'FederationSelector',
}
</script>
