<script setup lang="ts">
import { Club } from '@/domain/club'
import { Team, TeamMember } from '@/domain/team'
import { Player } from '@/domain/player'
import { Profile, mapApiProfileToProfile } from '@/domain/profile'
import { UpdateClubTeamPlayer } from 'components/Profile/Form.vue'
import { ApiProfile } from 'types/api/profile'
import TeamService from '@/services/team'

const teamService = new TeamService()
const toast = useEasyToast()
const { $i18n } = useNuxtApp()

const emit = defineEmits(['created', 'updated'])

const props = defineProps({
  club: {
    type: Object as PropType<Club>,
    required: false,
  },
  team: {
    type: Object as PropType<Team>,
    required: false,
  },
})

const form = ref<Team>({
  id: 0,
  name: '',
  club: undefined,
  sede: undefined,
  division: undefined,
  category: undefined,
  gender: undefined,
  coach: undefined,
  players: undefined,
})

const shirtNumberUpdatePlayer = ref<Player | TeamMember>()
const playerToRemove = ref<Player>()
const profileToEdit = ref<Profile>()
const showPlayerSearchFormDialog = ref<boolean>(false)

const loadingApi = ref<boolean>(false)

const clubTeamPlayerData: UpdateClubTeamPlayer =
  props.team?.id && props.team?.clubId
    ? {
        clubId: props.team.clubId,
        teamId: props.team.id,
      }
    : undefined

const setFormDataClub = (club: Club) => {
  form.value.club = club
}

const setFormData = (team: Team) => {
  form.value = team
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

const removePlayer = (id?: number) => {
  form.value.players = form.value.players?.filter(
    player => player.profileId !== id,
  )
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
        $i18n.t('players.shirt_number_taken', {
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

const setProfileToEdit = (profile: Profile) => {
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
    toast.success($i18n.t('teams.created'))
    emit('created', data.value.data.team)
  }

  loadingApi.value = false
}

const handleUpdate = async () => {
  loadingApi.value = true
  const { data, error } = await teamService.update(form.value.id, form.value)

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    toast.success($i18n.t('teams.updated'))
    emit('updated', data.value.data.team)
  }

  loadingApi.value = false
}

const handleAddPlayer = (player: Player) => {
  if (!form.value.players) {
    form.value.players = []
  }

  if (form.value.players.find(p => p.profileId === player.profileId)) {
    toast.error($i18n.t('players.already_added'))
    return
  }

  form.value.players.push(player)
  showPlayerSearchFormDialog.value = false
}

watch(
  () => props.club,
  value => {
    if (value) {
      setFormDataClub(value)
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => props.team,
  value => {
    if (value) {
      setFormData(value)
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <form class="easy-team-form-component" @submit.prevent="handleSubmit">
    <div :class="[{ 'grid gap-3 sm:grid-cols-2': club && club.sedes }]">
      <FormLabel :label="$t('forms.name')">
        <InputText v-model="form.name" />
      </FormLabel>
      <FormLabel v-if="club?.sedes" :label="$t('sedes.sede')">
        <SedeSelector :sedes="club.sedes" v-model="form.sede" />
      </FormLabel>
    </div>
    <div class="grid gap-3 sm:grid-cols-3 mt-3">
      <FormLabel :label="$t('divisions.division')">
        <DivisionSelector v-model="form.division" />
      </FormLabel>
      <FormLabel :label="$t('categories.category')">
        <CategorySelector v-model="form.category" />
      </FormLabel>
      <FormLabel :label="$t('genders.gender')">
        <GenderSelector v-model="form.gender" />
      </FormLabel>
    </div>
    <div class="players mt-10">
      <header class="header flex justify-between">
        <FormLabel :label="$t('players.player', 2)" />
        <Button
          :label="$t('players.add')"
          size="small"
          class="action"
          @click.prevent="showPlayerSearchFormDialog = true"
        />
      </header>
      <div class="players-list grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
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
      </div>
    </div>
    <div class="flex justify-end mt-10">
      <Button
        :label="team ? $t('teams.update') : $t('teams.create')"
        :loading="loadingApi"
        @click="handleSubmit"
        type="button"
      />
    </div>
    <GameCallShirtNumberDialog
      :player="shirtNumberUpdatePlayer"
      @update:player="changePlayerShirtNumber"
      @hide="shirtNumberUpdatePlayer = undefined"
    />
    <AlertDialog
      :visible="!!playerToRemove"
      :title="`${playerToRemove?.firstName} ${playerToRemove?.lastName}`"
      :message="$t('players.delete_alert')"
      :acceptLabel="$t('forms.delete')"
      severity="danger"
      @accepted="removePlayer(playerToRemove?.profileId)"
      @hide="playerToRemove = undefined"
    />
    <ProfileDialogForm
      :profile="profileToEdit"
      :club-team-player="clubTeamPlayerData"
      @updated="replaceUpdatedProfile"
      @hide="profileToEdit = undefined"
    />
    <PlayerSearchFormDialog
      :visible="!!showPlayerSearchFormDialog"
      @hide="showPlayerSearchFormDialog = false"
      @add="handleAddPlayer"
    />
  </form>
</template>

<script lang="ts">
export default {
  name: 'TeamForm',
}
</script>
