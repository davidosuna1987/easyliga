<script lang="ts" setup>
import TeamService from '@/services/team'
import { SEARCH_MIN_LENGTH } from '@/domain/utils'
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { AutoCompleteItemSelectEvent } from 'primevue/autocomplete'
import { LeagueShowTeam } from '@/domain/league-show'

const props = defineProps({
  team: {
    type: Object as PropType<LeagueShowTeam>,
    required: false,
  },
  selectedTeams: {
    type: Array as PropType<LeagueShowTeam[]>,
    default: [],
  },
  with: {
    type: Array as PropType<string[]>,
    required: false,
  },
  invitedToId: {
    type: Number,
    required: false,
  },
  full: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: false,
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  handleBlur: {
    type: Function as PropType<() => void>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'team:selected', value: LeagueShowTeam): void
}>()

const { t } = useI18n()
const toast = useEasyToast()
const teamService = new TeamService()

const search = ref<string>('')
const selectedTeam = ref<LeagueShowTeam | undefined>(props.team)
const matchTeams = ref<Team[]>()
const loadingApi = ref<boolean>(false)

const searchAvailable = computed(
  (): boolean => search.value.length >= SEARCH_MIN_LENGTH,
)
const selectedTeamsIds = computed(() =>
  props.selectedTeams.map(team => team.id),
)

const searchTeams = async () => {
  if (!searchAvailable.value) {
    toast.info(
      t('errors.min_length', { num: SEARCH_MIN_LENGTH }, SEARCH_MIN_LENGTH),
    )
    return
  }

  loadingApi.value = true

  const { data, error } = await teamService.fetch({
    scope: `name:${search.value}`,
    ...(props.with && { with: props.with.join(',') }),
  })

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    matchTeams.value = data.value.data.teams
      .map(team => mapApiTeamToTeam(team, false))
      .filter(team => !selectedTeamsIds.value.includes(team.id))
  }

  loadingApi.value = false
}

const handleRemoveTeam = () => {
  selectedTeam.value = undefined
  search.value = ''
}

const handleTeamSelected = (event: AutoCompleteItemSelectEvent) => {
  selectedTeam.value = event.value
  if (!selectedTeam.value) return

  if (selectedTeamsIds.value.includes(selectedTeam.value.id)) {
    toast.info(t('leagues.team_in_league_error'))
    handleRemoveTeam()
    return
  }

  emit('team:selected', selectedTeam.value)
}
</script>

<template>
  <form class="easy-team-search-input-component">
    <template v-if="!!selectedTeam">
      <FormLabel v-if="showLabel" :label="t('forms.you_selected')" />
      <LeagueTeamCard
        :team="selectedTeam"
        :selectable="false"
        :onRemove="handleRemoveTeam"
      />
    </template>
    <template v-else>
      <FormLabel v-if="showLabel" :label="label ?? t('teams.search')" />
      <AutoComplete
        v-model="search"
        :class="{ 'w-full': props.full }"
        :panelStyle="{ maxWidth: '400px' }"
        panelClass="team-search-input-autocomplete-panel"
        :input-class="{ 'w-full h-[42px]': props.full }"
        :suggestions="matchTeams"
        :auto-option-focus="false"
        :complete-on-focus="searchAvailable"
        @blur="handleBlur"
        @complete="searchTeams"
        @item-select="handleTeamSelected"
      >
        <template #option="slotProps">
          <LeagueTeamCard :team="slotProps.option" />
        </template>

        <template #empty>
          <div class="p-4 text-center">
            <p>{{ t('teams.name_not_found') }}</p>
          </div>
        </template>
      </AutoComplete>
    </template>
  </form>
</template>

<style lang="scss">
.team-search-input-autocomplete-panel {
  &.p-autocomplete-panel {
    max-height: 260px !important;

    .p-autocomplete-items {
      .p-autocomplete-item {
        padding: 0;

        .easy-league-team-card-component {
          border: none;
        }
      }
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'TeamSearchInput',
}
</script>
