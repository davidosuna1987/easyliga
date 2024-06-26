<script setup lang="ts">
import { League } from '@/domain/league'
import {
  Federation,
  FederationScope,
  mapApiFederationToFederation,
} from '@/domain/federation'
import FederationService from '@/services/federation'

const props = defineProps({
  groupedLeagues: {
    type: Array as PropType<Federation[]>,
    required: false,
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

const emit = defineEmits<{
  (e: 'league:selected', value: League): void
}>()

const { t } = useI18n()
const federationService = new FederationService()

const selectedLeague = ref<League | null>(null)
const loadingApi = ref<boolean>(false)

const groupedLeagues = ref<Federation[]>([])
const options = computed(
  (): Federation[] => props.groupedLeagues ?? groupedLeagues.value,
)

const getGroupedLeagues = async () => {
  loadingApi.value = true
  const { data } = await federationService.scopeWithLeagues(
    FederationScope.REGIONAL,
    {
      category_id: String(props.categoryId),
      gender_id: String(props.genderId),
    },
  )
  groupedLeagues.value =
    data.value?.data.federations.map(mapApiFederationToFederation) ?? []
  loadingApi.value = false
}

onMounted(() => {
  if (
    !!props.categoryId &&
    !!props.categoryId &&
    !groupedLeagues.value.length
  ) {
    getGroupedLeagues()
  }

  // remove leagues with invalid category or gender
  groupedLeagues.value = groupedLeagues.value.filter(federation => {
    federation.leagues = federation.leagues?.filter(league => {
      return (
        league.categoryId === props.categoryId &&
        league.genderId === props.genderId
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
    :placeholder="t('leagues.select')"
    @update:modelValue="emit('league:selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'FederationLeagueSelector',
}
</script>
