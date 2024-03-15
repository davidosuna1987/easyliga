<script setup lang="ts">
import { ApiLeague } from '@/types/api/league'
import { ApiFederation } from '@/types/api/federation'
import FederationService from '@/services/federation'
import { FederationScope } from '@/domain/federation'

const federationService = new FederationService()

const props = defineProps({
  groupedLeagues: {
    type: Array as PropType<ApiFederation[]>,
    default: null,
  },
  categoryId: {
    type: Number,
    default: null,
  },
  genderId: {
    type: Number,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const selectedLeague = ref<ApiLeague | null>(null)
const loadingApi = ref<boolean>(false)

const groupedLeagues = ref<ApiFederation[]>([])
const options = computed(
  (): ApiFederation[] => props.groupedLeagues ?? groupedLeagues.value,
)

onMounted(async () => {
  if (!props.groupedLeagues) {
    loadingApi.value = true
    const response = await federationService.scopeWithLeagues(
      FederationScope.REGIONAL,
      {
        category_id: props.categoryId.toString(),
        gender_id: props.genderId.toString(),
      },
    )
    groupedLeagues.value = response.data.value?.data
      .federations as ApiFederation[]
    loadingApi.value = false
  }

  // remove leagues with invalid category or gender
  groupedLeagues.value = groupedLeagues.value.filter(federation => {
    federation.leagues = federation.leagues?.filter(league => {
      return (
        league.category_id === props.categoryId &&
        league.gender_id === props.genderId
      )
    })
  })
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
