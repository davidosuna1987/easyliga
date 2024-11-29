<script setup lang="ts">
import { League, LeagueTeamAddFormRef } from '@/domain/league'
import { Team } from '@/domain/team'
import { LeagueShow, LeagueShowTeam } from '@/domain/league-show'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  league: {
    type: Object as PropType<LeagueShow>,
    required: true,
  },
  selectedTeams: {
    type: Array as PropType<LeagueShowTeam[]>,
    default: [],
  },
})

const emit = defineEmits<{
  (e: 'hide', value: boolean): void
  (e: 'team:added', value: LeagueShowTeam): void
}>()

const { t } = useI18n()

const leagueTeamAddFormRef = ref<LeagueTeamAddFormRef>()
const showDialog = ref<boolean>(props.visible)
const formLoading = ref<boolean>(false)

const handleFormSubmit = () => {
  leagueTeamAddFormRef.value?.handleSubmit()
}

const handleTeamAdded = (team: LeagueShowTeam) => {
  formLoading.value = false
  emit('team:added', team)
}

watch(
  () => props.visible,
  value => {
    showDialog.value = !!value
  },
)
</script>

<template>
  <DialogBottom
    class="easy-league-team-add-dialog-form-component"
    :visible="!!showDialog"
    @hide="emit('hide', true)"
  >
    <template #header>
      <Heading tag="h5">{{ t('teams.add') }}</Heading>
    </template>

    <LeagueTeamAddForm
      ref="leagueTeamAddFormRef"
      class="mt-6"
      :league="league"
      :selectedTeams="selectedTeams"
      dialog
      @team:added="handleTeamAdded"
      @loading="formLoading = $event"
      @hide="emit('hide', true)"
    />

    <template #stickyFooter>
      <FormFooterActions
        class="mt-10"
        :loading="formLoading"
        :submitLabel="t('teams.add')"
        @form:submit="handleFormSubmit"
        @form:cancel="emit('hide', true)"
      />
    </template>
  </DialogBottom>
</template>

<script lang="ts">
export default {
  name: 'LeagueTeamAddDialogForm',
}
</script>
