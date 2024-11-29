<script setup lang="ts">
import LeagueService from '@/services/league'
import { League } from '@/domain/league'
import { Team } from '@/domain/team'
import { getListTagColor } from '@/domain/list'
import { ApiErrorObject } from '@/types/errors'
import { ApiLeagueAddTeamFormRequest } from '@/types/api/league'
import { LeagueShow, LeagueShowTeam } from '@/domain/league-show'

const props = defineProps({
  league: {
    type: Object as PropType<LeagueShow>,
    required: true,
  },
  selectedTeams: {
    type: Array as PropType<LeagueShowTeam[]>,
    default: [],
  },
  dialog: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'hide', value: boolean): void
  (e: 'loading', value: boolean): void
  (e: 'team:added', value: LeagueShowTeam): void
}>()

const { t } = useI18n()
const toast = useEasyToast()
const leagueService = new LeagueService()

const selectedTeam = ref<LeagueShowTeam>()
const showAlertDialog = ref<boolean>(false)
const loadingApi = ref<boolean>(false)
const errors = ref<ApiErrorObject | null>(null)
const form = ref<ApiLeagueAddTeamFormRequest>({
  validate_relations: false,
  team_id: 0,
})

const selectedTeamHasValidFederation = computed(
  () => selectedTeam.value?.federation?.id === props.league.federationId,
)

const selectedTeamHasValidDivision = computed(
  () => selectedTeam.value?.divisionId === props.league.divisionId,
)
const selectedTeamHasValidCategory = computed(
  () => selectedTeam.value?.categoryId === props.league.categoryId,
)
const selectedTeamHasValidGender = computed(
  () => selectedTeam.value?.genderId === props.league.genderId,
)

const selectedTeamHasValidRelations = () =>
  !!selectedTeam.value &&
  selectedTeamHasValidFederation.value &&
  selectedTeamHasValidDivision.value &&
  selectedTeamHasValidCategory.value &&
  selectedTeamHasValidGender.value

const handleSubmit = () => {
  selectedTeamHasValidRelations() ? handleAdd() : handleShowAlertDialog()
}

const handleShowAlertDialog = () => {
  showAlertDialog.value = true
}

const handleAdd = async () => {
  if (!selectedTeam.value) {
    toast.error(t('teams.select_team_to_proceed'))
    return
  }

  loadingApi.value = true
  const { data, error } = await leagueService.addTeam(
    props.league.id,
    form.value,
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
    errors.value = error.value.data?.errors
    loadingApi.value = false
  } else if (data.value) {
    toast.success(t('teams.added'))
    emit('team:added', selectedTeam.value)
  }
}

const handleTeamSelected = (team: LeagueShowTeam) => {
  selectedTeam.value = team
  form.value.team_id = team.id
}

watch(loadingApi, value => {
  emit('loading', value)
})

defineExpose({
  handleSubmit,
  loadingApi,
})
</script>

<template>
  <form action="" class="easy-league-team-add-form-component">
    <TeamSearchInput
      :selectedTeams="selectedTeams"
      :with="['federation', 'division', 'category', 'gender']"
      full
      @team:selected="handleTeamSelected"
    />

    <FormFooterActions
      v-if="!dialog"
      class="mt-10"
      :loading="loadingApi"
      :submitLabel="t('teams.add')"
      hideCancel
      @form:submit="handleSubmit"
    />

    <AlertDialog
      v-if="selectedTeam"
      :visible="!!showAlertDialog"
      :title="t('leagues.add_team.invalid_team_relations')"
      :acceptLabel="t('forms.add')"
      :disabled="loadingApi"
      @accepted="handleAdd"
      @hide="showAlertDialog = false"
    >
      <p class="my-3 text-[1.15rem]">
        {{ t('leagues.add_team.invalid_team_relations_message') }}
      </p>

      <p class="mb-5 text-[1.15rem]">
        {{ t('leagues.add_team.invalid_team_relations_alert') }}
      </p>

      <EasyGrid :gap="3">
        <p v-if="!selectedTeamHasValidFederation">
          <strong>{{ t('federations.federation') }}:</strong>
          <span class="flex flex-col">
            <span class="text-highlight">{{ league.federation?.name }}</span>
            <span class="text-[var(--text-danger)]">{{
              selectedTeam.federation?.name
            }}</span>
          </span>
        </p>

        <p v-if="!selectedTeamHasValidDivision">
          <strong>{{ t('divisions.division') }}:</strong>
          <span class="flex flex-col">
            <span class="text-highlight">{{ league.division?.name }}</span>
            <span class="text-[var(--text-danger)]">{{
              selectedTeam.division?.name
            }}</span>
          </span>
        </p>

        <p v-if="!selectedTeamHasValidCategory" class="flex items-center gap-4">
          <strong>{{ t('categories.category') }}:</strong>
          <span class="flex gap-2">
            <ListTag :label="`${t(`categories.${league.category?.name}`)}`" />
            <span>→</span>
            <ListTag
              :label="`${t(`categories.${selectedTeam.category?.name}`)}`"
              color="danger"
            />
          </span>
        </p>

        <p v-if="!selectedTeamHasValidGender" class="flex items-center gap-4">
          <strong>{{ t('genders.gender') }}:</strong>
          <span class="flex gap-2">
            <ListTag
              :label="`${t(`genders.${league.gender?.name}`)}`"
              :color="getListTagColor(league.gender?.name)"
            />
            <span>→</span>
            <ListTag
              :label="`${t(`genders.${selectedTeam.gender?.name}`)}`"
              :color="getListTagColor(selectedTeam.gender?.name)"
            />
          </span>
        </p>
      </EasyGrid>
    </AlertDialog>
  </form>
</template>

<script lang="ts">
export default {
  name: 'LeagueTeamAddForm',
}
</script>
