<script setup lang="ts">
import {
  TeamFormRequest,
  Team,
  TeamMember,
  mapTeamToTeamFormRequest,
  mapApiTeamToTeam,
} from '@/domain/team'
import {
  Player,
  UpdateClubTeamPlayer,
  mapPlayerToApiPlayerRequest,
} from '@/domain/player'
import { Profile, mapApiProfileToProfile } from '@/domain/profile'
import { ApiProfile } from '@/types/api/profile'
import TeamService from '@/services/team'
import { Sede } from '@/domain/sede'
import { Division } from '@/domain/division'
import { Category, Gender } from '@/domain/game'
import { User, UserSearchFormInputRef } from '@/domain/user'
import { LICENSABLE_TYPE_MAPPER } from '@/domain/licensable'
import { License } from '@/domain/license'
import { ROLE_MAPPER } from '@/domain/role'

const props = defineProps({
  sedes: {
    type: Array as PropType<Sede[]>,
    required: true,
  },
  team: {
    type: Object as PropType<Team>,
    required: false,
  },
  isResponsible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'team:created', value: Team): void
  (e: 'team:updated', value: Team): void
  (e: 'refresh', value: boolean): void
}>()

const { t } = useI18n()
const route = useRoute()
const toast = useEasyToast()
const teamService = new TeamService()

const coachSearchFormInputRef = ref<UserSearchFormInputRef>()
const substituteCoachSearchFormInputRef = ref<UserSearchFormInputRef>()

const clubId = ref(props.team?.clubId ?? Number(route.params.clubId))

const form = ref<TeamFormRequest>(
  mapTeamToTeamFormRequest(props.team, clubId.value),
)

const teamLicenses = ref<License[]>([])
const selectedSede = ref<Sede>()
const selectedDivision = ref<Division>()
const selectedCategory = ref<Category>()
const selectedGender = ref<Gender>()
const selectedCoach = ref<User>()
const teamSubstituteCoaches = ref<User[]>(props.team?.substituteCoaches ?? [])
const shirtNumberUpdatePlayer = ref<Player | TeamMember>()
const substituteCoachToRemove = ref<User>()
const playerToRemove = ref<Player>()
const profileToEdit = ref<Profile>()
const showPlayerSearchFormDialog = ref<boolean>(false)
const loadingApi = ref<boolean>(false)

const clubTeamPlayerData = computed((): UpdateClubTeamPlayer | undefined =>
  props.team?.id && props.team?.clubId
    ? {
        clubId: props.team.clubId,
        teamId: props.team.id,
      }
    : undefined,
)

const unavailableShirtNumbers = computed(() =>
  form.value.players?.map(player => player.shirtNumber),
)

const coachSearchFormInputLabel = computed(() => {
  if (coachSearchFormInputRef.value?.userChanged) {
    return t('coaches.new')
  }

  return coachSearchFormInputRef.value?.editingUser ||
    (!readonly && !selectedCoach.value?.profile)
    ? t('coaches.search')
    : t('coaches.coach')
})

const substituteCoachesLabel = computed(() =>
  teamSubstituteCoaches.value?.length
    ? t('coaches.substitute', teamSubstituteCoaches.value.length)
    : t('coaches.add_substitute'),
)

const substituteCoachesSearchFormInputLabel = computed(() =>
  teamSubstituteCoaches.value?.length ? t('coaches.add_substitute') : undefined,
)

const setFormData = (team?: Team) => {
  teamLicenses.value = team?.licenses ?? []
  selectedDivision.value = team?.division
  selectedCategory.value = team?.category
  selectedGender.value = team?.gender
  selectedCoach.value = team?.coach

  form.value = mapTeamToTeamFormRequest(team, clubId.value)

  const teamSede =
    props.sedes.length === 1
      ? props.sedes[0]
      : props.sedes?.find(sede => sede.id === team?.sedeId)

  teamSede && handleSedeSelected(teamSede)
}

const setCaptain = (id: number) => {
  const player = form.value.players?.find(player => player.profileId === id)
  if (player) {
    player.captain = !player.captain
  }
}

const setLibero = (id: number) => {
  const player = form.value.players?.find(player => player.profileId === id)
  if (player) {
    player.libero = !player.libero
  }
}

const removePlayerAlert = (id: number) => {
  playerToRemove.value = form.value.players?.find(
    player => player.profileId === id,
  )
}

const removePlayer = async (profileId?: number) => {
  if (!profileId) return

  loadingApi.value = true

  const { data, error } = await teamService.deletePlayer(
    form.value.id,
    profileId,
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    toast.success(t('players.deleted'))
    emit('refresh', true)
  }

  loadingApi.value = false

  // form.value.players = form.value.players?.filter(
  //   player => player.profileId !== profileId,
  // )
  playerToRemove.value = undefined
}

const shirtNumberAlreadyTaken = (player: Player) => {
  return form.value?.players?.find(
    p =>
      p.profileId !== player.profileId && p.shirtNumber === player.shirtNumber,
  )
}

const setShirtNumberUpdatePlayer = (player: Player | TeamMember) => {
  shirtNumberUpdatePlayer.value = player
}

const changePlayerShirtNumber = (player?: Player) => {
  if (
    !player ||
    !form.value.players?.find(p => p.profileId === player.profileId)
  ) {
    shirtNumberUpdatePlayer.value = undefined
  } else {
    if (shirtNumberAlreadyTaken(player)) {
      toast.error(
        t('players.shirt_number_taken', {
          shirtNumber: player.shirtNumber,
        }),
      )
      return
    }
    form.value.players?.map(p => {
      if (p.profileId === player.profileId) {
        p.shirtNumber = player.shirtNumber
      }
    })

    shirtNumberUpdatePlayer.value = undefined
  }
}

const setProfileToEdit = (profile: Profile | undefined) => {
  profileToEdit.value = profile
}

const replaceUpdatedProfile = (apiProfile: ApiProfile) => {
  const profile: Profile = mapApiProfileToProfile(apiProfile)

  form.value.players?.map(player => {
    if (player.profileId === profile.id) {
      player.profile = profile
      player.firstName = profile.firstName
      player.lastName = profile.lastName
    }
  })

  profileToEdit.value = undefined
}

const handleSubmit = () => {
  !!props.team ? handleUpdate() : handleStore()
}

const handleStore = async () => {
  loadingApi.value = true
  const { data, error } = await teamService.store(form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    toast.success(t('teams.created'))
    emit('team:created', mapApiTeamToTeam(data.value.data.team))
  }

  loadingApi.value = false
}

const handleUpdate = async () => {
  loadingApi.value = true

  const coachFormData = { players: form.value.players }

  const { data, error } = props.isResponsible
    ? await teamService.update(form.value.id, form.value)
    : await teamService.updatePlayers(form.value.id, coachFormData)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    toast.success(t('teams.updated'))
    emit('team:updated', mapApiTeamToTeam(data.value.data.team))
  }

  loadingApi.value = false
}

const handleAddPlayer = async (player: Player) => {
  loadingApi.value = true
  const { data, error } = await teamService.addPlayer(
    form.value.id,
    mapPlayerToApiPlayerRequest(player),
  )

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    if (!form.value.players) {
      form.value.players = []
    }

    if (form.value.players.find(p => p.profileId === player.profileId)) {
      toast.error(t('players.already_added'))
      return
    }

    form.value.players.push(player)
    showPlayerSearchFormDialog.value = false

    toast.success(t('players.added'))
  }

  loadingApi.value = false
}

const handleSedeSelected = (sede: Sede) => {
  selectedSede.value = sede
  form.value.sedeId = sede.id
}

const handleDivisionSelected = (division: Division) => {
  selectedDivision.value = division
  form.value.divisionId = division.id
}

const handleCategorySelected = (category: Category) => {
  selectedCategory.value = category
  form.value.categoryId = category.id
}

const handleGenderSelected = (gender: Gender) => {
  selectedGender.value = gender
  form.value.genderId = gender.id
}

const handleCoachSelected = (coach: User) => {
  selectedCoach.value = coach
  form.value.coachId = coach.id
}

const handleSubstituteCoachSelected = (coach: User) => {
  if (coachAlreadyInTeam(coach)) {
    substituteCoachSearchFormInputRef.value?.clear()
    toast.error(t('errors.coach_already_in_team'))
    return
  }
  teamSubstituteCoaches.value.push(coach)
  form.value.substituteCoachesIds = [
    ...(form.value.substituteCoachesIds ?? []),
    coach.id,
  ]
  substituteCoachSearchFormInputRef.value?.clear()
}

const setSubstituteCoachToRemove = (profileId: number) => {
  substituteCoachToRemove.value = teamSubstituteCoaches.value.find(
    coach => coach.profile?.id === profileId,
  )
}

const handleRemoveSubstituteCoach = (coachId?: number) => {
  if (!coachId) return

  teamSubstituteCoaches.value = teamSubstituteCoaches.value.filter(
    c => c.id !== coachId,
  )
  form.value.substituteCoachesIds = form.value.substituteCoachesIds?.filter(
    id => id !== coachId,
  )

  substituteCoachToRemove.value = undefined
}

const coachAlreadyInTeam = (coach: User) => {
  return (
    selectedCoach.value?.id === coach.id ||
    teamSubstituteCoaches.value.find(c => c.id === coach.id)
  )
}

const stopEditingCoach = (cancel = false) => {
  if (cancel && props.team?.coach) handleCoachSelected(props.team.coach)

  if (
    coachSearchFormInputRef.value?.editingUser &&
    !coachSearchFormInputRef.value?.userChanged
  ) {
    coachSearchFormInputRef.value?.stopEditing()
  }
}

const stopEditingSubstituteCoach = () => {
  if (
    substituteCoachSearchFormInputRef.value?.editingUser &&
    !substituteCoachSearchFormInputRef.value?.userChanged
  ) {
    substituteCoachSearchFormInputRef.value?.stopEditing()
  }
}

watch(
  () => props.team,
  value => {
    setFormData(value)
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <form class="easy-team-form-component" @submit.prevent="handleSubmit">
    <template v-if="props.isResponsible">
      <EasyGrid
        :breakpoints="{ sm: 2, lg: 3 }"
        :gap="3"
        @mouseenter="stopEditingCoach()"
      >
        <FormLabel :label="t('forms.name')">
          <InputText v-model="form.name" />
        </FormLabel>

        <SedeSelector
          v-model="selectedSede"
          :sedes="sedes"
          :clubId="clubId"
          :label="t('sedes.sede')"
          @sede:selected="handleSedeSelected"
        />

        <FormLabel :label="t('teams.shirt_color')">
          <TeamShirtColorSelector v-model="form.shirtColor" />
        </FormLabel>

        <FormLabel :label="t('divisions.division')">
          <DivisionSelector
            v-model="selectedDivision"
            @division:selected="handleDivisionSelected"
          />
        </FormLabel>

        <FormLabel :label="t('categories.category')">
          <CategorySelector
            v-model="selectedCategory"
            @category:selected="handleCategorySelected"
          />
        </FormLabel>

        <FormLabel :label="t('genders.gender')">
          <GenderSelector
            v-model="selectedGender"
            @gender:selected="handleGenderSelected"
          />
        </FormLabel>
      </EasyGrid>

      <div v-if="team" class="mt-10" @mouseenter="stopEditingCoach()">
        <LicenseList
          :type="LICENSABLE_TYPE_MAPPER.team"
          :licenses="teamLicenses"
          :licensable="team"
          @license:success="emit('refresh', true)"
        />
      </div>

      <div class="mt-10">
        <UserSearchFormInput
          ref="coachSearchFormInputRef"
          :userOriginal="props.team?.coach"
          :userSelected="selectedCoach"
          :invitedToId="props.team?.id"
          :whereRole="ROLE_MAPPER.coach"
          :label="coachSearchFormInputLabel"
          :breakpoints="{ sm: 2, lg: 3 }"
          @selected="handleCoachSelected"
          @invited="stopEditingCoach(true)"
          @cancel="stopEditingCoach(true)"
        />
      </div>

      <div v-if="!!form.coachId" class="mt-10">
        <FormLabel :label="substituteCoachesLabel" />
        <EasyGrid
          v-if="teamSubstituteCoaches.length"
          class="substitute-coaches-list"
          :breakpoints="{ sm: 2, lg: 3, xl: 4 }"
          :gap="3"
        >
          <template v-for="coach in teamSubstituteCoaches">
            <ProfileItem
              v-if="coach.profile"
              :profile="coach.profile"
              :onRemove="setSubstituteCoachToRemove"
              :removeTooltip="t('coaches.delete')"
            />
          </template>
        </EasyGrid>

        <UserSearchFormInput
          ref="substituteCoachSearchFormInputRef"
          class="mt-3"
          :invitedToId="props.team?.id"
          :whereRole="ROLE_MAPPER.coach"
          :label="substituteCoachesSearchFormInputLabel"
          :breakpoints="{ sm: 2, lg: 3 }"
          :editable="false"
          @selected="handleSubstituteCoachSelected"
          @invited="stopEditingSubstituteCoach"
          @cancel="stopEditingSubstituteCoach"
        />
      </div>
    </template>

    <div v-if="team" class="players mt-10" @mouseenter="stopEditingCoach()">
      <header class="header flex justify-between items-center mb-3">
        <FormLabel :label="t('players.player', 2)" />
        <Button
          :label="t('players.add')"
          size="small"
          class="action"
          @click.prevent="showPlayerSearchFormDialog = true"
        />
      </header>

      <EasyGrid class="players-list" :breakpoints="{ lg: 2, xl: 3 }" :gap="3">
        <PlayerItem
          v-for="player in form.players"
          :key="player.profileId"
          :player="player"
          :setCaptain="setCaptain"
          :setLibero="setLibero"
          :setShirtNumberUpdatePlayer="setShirtNumberUpdatePlayer"
          :removePlayer="removePlayerAlert"
          editable
          @profile:edit="setProfileToEdit"
        />
      </EasyGrid>
    </div>

    <FormFooterActions
      :submitLabel="team ? t('teams.update') : t('teams.create')"
      :loading="loadingApi"
      stickyBreakpoint="xs"
      hideCancel
      @form:submit="handleSubmit"
      @mouseenter="stopEditingCoach()"
    />

    <GameCallShirtNumberDialog
      :player="shirtNumberUpdatePlayer"
      @update:player="changePlayerShirtNumber"
      @hide="shirtNumberUpdatePlayer = undefined"
    />

    <ProfileDialogForm
      :profile="profileToEdit"
      :club-team-player="clubTeamPlayerData"
      hideAvatar
      hidePlayerId
      hideRoles
      @updated="replaceUpdatedProfile"
      @hide="profileToEdit = undefined"
    />

    <PlayerSearchFormDialog
      v-if="team"
      :visible="!!showPlayerSearchFormDialog"
      :team="team"
      :unavailableShirtNumbers="unavailableShirtNumbers"
      :loading="loadingApi"
      @hide="showPlayerSearchFormDialog = false"
      @player:add="handleAddPlayer"
    />

    <AlertDialog
      :visible="!!playerToRemove"
      :title="`${playerToRemove?.firstName} ${playerToRemove?.lastName}`"
      :message="t('players.delete_alert')"
      :acceptLabel="t('forms.delete')"
      severity="danger"
      @accepted="removePlayer(playerToRemove?.profileId)"
      @hide="playerToRemove = undefined"
    />

    <AlertDialog
      v-if="substituteCoachToRemove"
      :visible="!!substituteCoachToRemove"
      :title="`${substituteCoachToRemove.profile?.firstName} ${substituteCoachToRemove.profile?.lastName}`"
      :message="t('coaches.delete_substitute_alert')"
      :acceptLabel="t('forms.delete')"
      severity="danger"
      @accepted="
        handleRemoveSubstituteCoach(substituteCoachToRemove.profile?.id)
      "
      @hide="playerToRemove = undefined"
    />
  </form>
</template>

<script lang="ts">
export default {
  name: 'TeamForm',
}
</script>
