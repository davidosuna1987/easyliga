<script setup lang="ts">
import { useFederationStore } from '@/stores/useFederationStore'
import { ApiFederation } from 'types/api/federation'

const easyStorage = useEasyStorage()
const toast = useEasyToast()
const federation = useFederationStore()

const federations = ref<ApiFederation[]>(
  easyStorage.getNested('federations.federations', []),
)

const fetch = async () => {
  const { data, error } = await federation.fetch()
  federations.value = (data.value?.data.federations as ApiFederation[]) ?? []

  if (error.value) {
    if (error.value.data?.errors instanceof Array) {
      toast.error(error.value.data?.errors[0])
    }
  }
}
</script>

<template>
  <FederationSelector @selected="console.log('selected', $event)" />
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'GameForm',
}
</script>
