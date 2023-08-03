<script setup lang="ts">
import { ApiLeague } from '@/types/api/league'
import { ApiFederationWithLeagues } from '@/types/api/federation'
import FederationService from '@/services/federation'

const federationService = new FederationService()

const props = defineProps({
  groupedLeagues: {
    type: Array as PropType<ApiFederationWithLeagues[]>,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const selectedLeague = ref<ApiLeague | null>(null)
const loadingApi = ref<boolean>(false)

const groupedLeagues = ref<ApiFederationWithLeagues[]>([])
const options = computed(
  (): ApiFederationWithLeagues[] =>
    props.groupedLeagues ?? groupedLeagues.value,
)

onMounted(async () => {
  if (!props.groupedLeagues) {
    loadingApi.value = true
    const response = await federationService.scope('national', {
      with: 'leagues',
    })
    groupedLeagues.value = response.data.value?.data
      .federations as ApiFederationWithLeagues[]
    loadingApi.value = false
  }
})
</script>

<template>
  <Dropdown
    class="easy-leagues-selector-component"
    v-model="selectedLeague"
    :loading="props.loading || loadingApi"
    :options="options"
    optionLabel="name"
    :optionValue="league => league"
    optionGroupChildren="leagues"
    optionGroupLabel="name"
    scrollHeight="210px"
    :placeholder="$t('leagues.select')"
    @update:modelValue="$emit('selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'FederationLeagueSelector',
}
</script>
