<script lang="ts" setup>
import { Club, mapApiClubToClub } from '@/domain/club'
import ClubService from '@/services/club'
import { Team } from 'domain/team'

const { t } = useI18n()
const route = useRoute()
const toast = useEasyToast()
const clubService = new ClubService()

const club = ref<Club>()
const loadingApi = ref<boolean>(false)

const getClub = async () => {
  loadingApi.value = true
  const { data, error } = await clubService.get(Number(route.params.clubId), {
    with: 'sedes',
  })

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    club.value = mapApiClubToClub(data.value.data.club)
  }

  loadingApi.value = false
}

const handleTeamCreated = (team: Team) => {
  navigateTo(`/clubs/${club.value?.id}/teams/${team.id}/edit`)
}

onMounted(getClub)
</script>

<template>
  <div class="easy-team-edit-component">
    <Loading v-if="loadingApi" />
    <template v-else-if="club">
      <Heading tag="h3" class="mb-5">
        {{ t('teams.create') }}
      </Heading>
      <Heading tag="h5" class="mb-5 font-bold">
        {{ club.name }}
      </Heading>
      <TeamForm :sedes="club.sedes ?? []" @team:created="handleTeamCreated" />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TeamCreate',
}
</script>
