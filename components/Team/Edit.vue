<script lang="ts" setup>
import { Team, mapApiTeamToTeam } from '@/domain/team'
import TeamService from '@/services/team'

const route = useRoute()
const toast = useEasyToast()
const easyProps = useEasyProps()
const teamService = new TeamService()

const team = ref<Team>()
const loadingApi = ref<boolean>(false)

const getTeam = async () => {
  loadingApi.value = true
  const { data, error } = await teamService.get(Number(route.params.id), {
    with: 'division,category,gender,coach,players',
  })

  if (error.value) {
    toast.mapError(Object.values(error.value?.data?.errors), false)
  } else if (data.value) {
    team.value = mapApiTeamToTeam(data.value.data.team)
  }

  loadingApi.value = false
}

const setInitialTeam = async () => {
  const propsTeam = easyProps.get(`team.${route.params.id}.edit`)
  if (propsTeam) {
    team.value = propsTeam as Team
  }

  await getTeam()
}

onMounted(setInitialTeam)
</script>

<template>
  <div class="easy-team-edit-component">
    <Loading v-if="loadingApi" />
    <template v-else-if="team">
      <Heading tag="h3" class="mb-5">
        {{ $t('teams.edit') }}
      </Heading>
      <TeamForm :team="team" />
    </template>
  </div>
</template>
