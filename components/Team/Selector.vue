<script setup lang="ts">
import TeamService from '@/services/team'
import { Team, mapApiTeamToTeam } from '@/domain/team'

const teamService = new TeamService()

const props = defineProps({
  teams: {
    type: Array as PropType<Team[]>,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  preFetch: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'team:selected', value: Team): void
}>()

const { t } = useI18n()

const teams = ref<Team[]>([])
const selectedTeam = ref<Team | null>(null)
const loadingApi = ref<boolean>(false)

const options = computed((): Team[] => props.teams ?? teams.value)

const getTeams = async () => {
  loadingApi.value = true
  loadingApi.value = true
  const { data } = await teamService.fetch()
  teams.value = data.value?.data.teams.map(team => mapApiTeamToTeam(team)) ?? []
  loadingApi.value = false
}

onMounted(() => {
  if (props.preFetch && !teams.value.length) {
    getTeams()
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
    @update:modelValue="emit('team:selected', $event)"
  />
</template>

<script lang="ts">
export default {
  name: 'TeamSelector',
}
</script>
