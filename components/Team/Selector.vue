<script setup lang="ts">
import TeamService from '@/services/team'
import { ApiTeam } from '@/types/api/team'

const teamService = new TeamService()

const props = defineProps({
  teams: {
    type: Array as PropType<ApiTeam[]>,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()

const teams = ref<ApiTeam[]>([])
const selectedTeam = ref<ApiTeam | null>(null)
const loadingApi = ref<boolean>(false)

const options = computed((): ApiTeam[] => props.teams ?? teams.value)

onMounted(async () => {
  if (!props.teams) {
    loadingApi.value = true
    const response = await teamService.fetch()
    teams.value = response.data.value?.data.teams ?? []
    loadingApi.value = false
  }
})
</script>

<template>
  <Dropdown
    class="easy-teams-selector-component"
    v-model="selectedTeam"
    :loading="props.loading || loadingApi"
    :options="options"
    optionLabel="name"
    :optionValue="team => team"
    scrollHeight="210px"
    :placeholder="t('teams.select')"
    @update:modelValue="$emit('selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'TeamSelector',
}
</script>
