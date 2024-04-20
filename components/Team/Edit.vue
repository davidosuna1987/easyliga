<script lang="ts" setup>
import { Team, mapApiTeamToTeam } from '@/domain/team'
import { Club } from '@/domain/club'
import TeamService from '@/services/team'

const route = useRoute()
const toast = useEasyToast()
const easyProps = useEasyProps()
const teamService = new TeamService()

const club = ref<Club>()
const team = ref<Team>()
const loadingApi = ref<boolean>(false)

const getTeam = async () => {
  loadingApi.value = true
  const { data, error } = await teamService.get(Number(route.params.teamId), {
    with: 'division,category,gender,coach.profile,players.address',
  })

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    team.value = mapApiTeamToTeam(data.value.data.team, true)
  }

  loadingApi.value = false
}

const setInitialClubTeam = async () => {
  // const easyData = easyProps.get(
  //   `clubs.${route.params.clubId}.teams.${route.params.teamId}.edit`,
  //   false,
  // )

  // if (easyData.club) {
  //   club.value = easyData.club as Club
  // }

  // if (easyData.team) {
  //   team.value = easyData.team as Team
  // }

  await getTeam()
}

onMounted(setInitialClubTeam)
</script>

<template>
  <div class="easy-team-edit-component">
    <Loading v-if="loadingApi" />
    <template v-else-if="team">
      <Heading tag="h3" class="mb-5">
        {{ $t('teams.edit') }}
      </Heading>
      <TeamForm :club="club" :team="team" />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TeamEdit',
}
</script>
